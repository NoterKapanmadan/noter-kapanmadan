'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { formatDateAndTime } from "@/utils/date";
import { SERVER_URL } from '@/utils/constants'
import Link from 'next/link'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [userIdFilter, setUserIdFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
      const response = await fetch(`${SERVER_URL}/admin/get-transactions?searchKey=${userIdFilter}`)
  
      if (response.ok) {
        const data =  await response.json()
        console.log(data)
        setTransactions(data)
        setLoading(false)
        console.log(data)
      }
    }
  
    useEffect(() => { 
      fetchTransactions()
    } , [])
  
    useEffect(() => {
      const handler = setTimeout(() => {
        fetchTransactions()
      }, 120);
  
      return () => {
        clearTimeout(handler);
      };
    }, [userIdFilter]);

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
      {loading ? (
        <div className="font-medium text-center">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="flex flex-col p-4">
              <div className="flex justify-between items-start *:w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">
                    Transaction ID: <span className="text-black">{transaction.transaction_id}</span>
                  </p>
                  {transaction.sender_id && (<p className="text-sm text-gray-600">
                    Sender ID: {' '}
                    <Link 
                      href={`/profile/${transaction.sender_id}`} 
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {transaction.sender_id}
                    </Link>
                  </p>)}
                  {transaction.receiver_id && (<p className="text-sm text-gray-600">
                    Receiver ID: {' '}
                    <Link 
                      href={`/profile/${transaction.receiver_id}`} 
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {transaction.receiver_id}
                    </Link>
                  </p>)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">
                    Date: <span className="text-black">{formatDateAndTime(transaction.date)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: <span className="text-black">{transaction.type}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex gap-1 items-center">
                    Amount: <span className="text-black font-semibold">{transaction.amount} TL</span>
                  </p>  
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

