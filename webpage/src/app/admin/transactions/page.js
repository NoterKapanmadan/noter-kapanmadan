'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { formatDateAndTime } from "@/utils/date";

const mockTransactions = [
  { id: '1', userId: '101', amount: 100, date: new Date() },
  { id: '2', userId: '102', amount: 200, date: new Date() },
  { id: '3', userId: '101', amount: 150, date: new Date() },
]

export default function Transactions() {
  const [transactions] = useState(mockTransactions)
  const [userIdFilter, setUserIdFilter] = useState('')

  const filteredTransactions = transactions.filter(transaction => 
    transaction.userId.includes(userIdFilter)
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Filter by User ID or Transaction ID"
          value={userIdFilter}
          onChange={(e) => setUserIdFilter(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex flex-col gap-2">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-600">Transaction ID: {transaction.id}</p>
                <p className="text-sm text-gray-600">User ID: {transaction.userId}</p>
                <p className="text-sm text-gray-600">Date: {formatDateAndTime(transaction.date)}</p>
              </div>
              <h3 className="text-lg font-semibold">{transaction.amount} TL</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

