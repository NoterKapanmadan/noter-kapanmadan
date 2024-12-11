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

export default function BalancePage({user_balance}) {
  const { toast } = useToast()
  const [balance, setBalance] = useState(Number(user_balance))
  const [addBalanceAmount, setAddBalanceAmount] = useState('')
  const [withdrawBalanceAmount, setWithdrawBalanceAmount] = useState('')

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
      return toast({
        title: "Balance added",
        description: `$${amount} has been added to your account.`
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
      if (amount > balance) {
        return toast({
          title: "Insufficient balance",
          description: "You do not have enough balance to withdraw this amount."
        })
      }
      const res = await fetch(`${SERVER_URL}/balance/set-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: -amount }),
      });
      if (!res.ok) {
        return toast({
          title: "Error withdrawing balance",
          description: "An error occurred while withdrawing balance."
        })
      }
      setBalance(prevBalance => prevBalance - amount)
      setWithdrawBalanceAmount('')
      return toast({
        title: "Balance withdrawn",
        description: `$${amount} has been withdrawn from your account.`
      })
  })
  }
  console.log("user_balance:", user_balance);
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
              <div className="text-2xl font-bold">${balance}</div>
            </div>
            <Dialog>
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="addBalanceAmount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="addBalanceAmount"
                      type="number"
                      step="0.01"
                      value={addBalanceAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^\d*(\.\d{0,2})?$/.test(value)) {
                          setAddBalanceAmount(value)
                        }
                      }}
                      className="col-span-3"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddBalance}>Add Balance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="withdrawBalanceAmount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="withdrawBalanceAmount"
                      type="number"
                      step="0.01"
                      value={withdrawBalanceAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (/^\d*(\.\d{0,2})?$/.test(value)) {
                          setWithdrawBalanceAmount(value)
                        }
                      }}
                      className="col-span-3"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleWithdrawBalance}>Withdraw Balance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
