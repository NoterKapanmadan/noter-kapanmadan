import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTransactions,getAccountID } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateAndTime } from "@/utils/date";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TransactionsPage() {
  const res = await getTransactions();
  const account_id = await getAccountID();
  // console.log(res)
  const transactions = res.map((transaction) => {
    return {
      id: transaction.transaction_id,
      date: transaction.date,
      type: transaction.receiver_id && !transaction.sender_id ? "Deposit to Balance" : transaction.sender_id && !transaction.receiver_id ? "Withdrawn from Balance" : transaction.receiver_id === account_id ? "Sell Vehicle" : transaction.sender_id === account_id ? "Buy Vehicle" : "Unknown Transaction",
      adId: transaction.ad_id,
      adOwner: transaction.sender_id === account_id ? transaction.receiver_id : transaction.sender_id,
      amount: transaction.amount,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6 sm:px-6 lg:px-8">
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
                    <TableCell>{formatDateAndTime(transaction.date)}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      {transaction.adId && transaction.adOwner ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span>Ad ID: {transaction.adId}</span>
                            <Link href={`/ad/${transaction.adId}`}>
                              <Button variant="outline" className="ml-2 text-blue-600">
                                View Ad
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Owner ID: {transaction.adOwner}</span>
                            <Link href={`/profile/${transaction.adOwner}`}>
                              <Button variant="outline" className="ml-2 text-blue-600">
                                View Owner
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${transaction.type === "Buy Vehicle"|| transaction.type === "Withdrawn from Balance" ? 'text-red-600': 'text-green-600' }`}>
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