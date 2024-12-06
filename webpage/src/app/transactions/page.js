"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TransactionsPage() {
  const [balance, setBalance] = useState(500)
  const [addBalanceAmount, setAddBalanceAmount] = useState('')
  const [transactions, setTransactions] = useState([
    { id: 1, date: '10-11-2024', type: 'Buy Vehicle', amount: -19500, adId: 'AD123', adOwner: 'John Doe' },
    { id: 2, date: '08-11-2024', type: 'Balance Added', amount: 20000, adId: null, adOwner: null },
  ])

  const handleAddBalance = () => {
    const amount = parseFloat(addBalanceAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      })
      return
    }
    setBalance(prevBalance => prevBalance + amount)
    setTransactions(prevTransactions => [
      { id: prevTransactions.length + 1, date: new Date().toISOString().split('T')[0], type: 'Balance Added', amount, adId: null, adOwner: null },
      ...prevTransactions
    ])
    setAddBalanceAmount('')
    toast({
      title: "Balance added",
      description: `$${amount} has been added to your account.`
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
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
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
                      value={addBalanceAmount}
                      onChange={(e) => setAddBalanceAmount(e.target.value)}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ad Details</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      {transaction.adId && transaction.adOwner ? (
                        <>
                          Ad ID: {transaction.adId}<br />
                          Ad Owner: {transaction.adOwner}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}