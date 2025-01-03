"use client"

import React, { startTransition, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";

export default function BalancePage({ user_balance }) {
  const { toast } = useToast()
  const [balance, setBalance] = useState(Number(user_balance))
  const [addBalanceAmount, setAddBalanceAmount] = useState('')
  const [withdrawBalanceAmount, setWithdrawBalanceAmount] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)

  const handleAddBalance = () => {
    startTransition(async () => {
      let amount = parseFloat(addBalanceAmount)
      amount = Math.round(amount * 100) / 100
      if (isNaN(amount) || amount <= 0) {
        return toast({
          title: "Invalid amount",
          description: "Please enter a valid amount."
        })
      }
      const res = await fetch(`${SERVER_URL}/balance/set-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: amount }),
      });
      if (!res.ok) {
        return toast({
          title: "Error adding balance",
          description: "An error occurred while adding balance."
        })
      }
      setBalance(prevBalance => prevBalance + amount)
      setAddBalanceAmount('')
      setIsAddDialogOpen(false)
      return toast({
        title: "Balance added",
        description: `${amount} TL has been added to your account.`
      })
    })
  }

  const handleWithdrawBalance = async () => {
    startTransition(async () => {
      let amount = parseFloat(withdrawBalanceAmount)
      amount = Math.round(amount * 100) / 100
      if (isNaN(amount) || amount <= 0) {
        return toast({
          title: "Invalid amount",
          description: "Please enter a valid amount."
        })
      }
      //console.log("withdraw amount:", amount);
      const res = await fetch(`${SERVER_URL}/balance/set-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: -amount }),
      });
      if (!res.ok) {
        const s = await res.json()
        return toast({
          title: "Error withdrawing balance",
          description: s.message ? s.message : "An error occurred while withdrawing balance."
        })
      }
      setBalance(prevBalance => prevBalance - amount)
      setWithdrawBalanceAmount('')
      setIsWithdrawDialogOpen(false)
      return toast({
        title: "Balance withdrawn",
        description: `${amount} TL has been withdrawn from your account.`
      })
    })
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Account Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="balance">Current Balance</Label>
              <div className="text-2xl font-bold">{balance} TL</div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Add Balance</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Balance</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to add to your account balance.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      handleAddBalance();
                    }}
                    className="grid gap-4 py-4"
                  >
                    <div className="flex flex-col items-start gap-3">
                      <Label htmlFor="addBalanceAmount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="addBalanceAmount"
                        type="number"
                        step="0.01"
                        value={addBalanceAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*(\.\d{0,2})?$/.test(value)) {
                            setAddBalanceAmount(value);
                          }
                        }}
                        className="col-span-3"
                        placeholder="Enter amount"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Balance</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Withdraw Balance</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Withdraw Balance</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to withdraw from your account balance.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      handleWithdrawBalance();
                    }}
                    className="grid gap-4 py-4"
                  >
                    <div className="flex flex-col items-start gap-3">
                      <Label htmlFor="withdrawBalanceAmount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="withdrawBalanceAmount"
                        type="number"
                        step="0.01"
                        value={withdrawBalanceAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*(\.\d{0,2})?$/.test(value)) {
                            setWithdrawBalanceAmount(value);
                          }
                        }}
                        className="col-span-3"
                        placeholder="Enter amount"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Withdraw Balance</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
