
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

export default async function TransactionsPage() {
  const res = await getTransactions();
  const account_id = await getAccountID();
  console.log(res)
  const transactions = res.map((transaction) => {
    return {
      id: transaction.transaction_id,
      date: new Date(transaction.date).toLocaleString(),
      type: transaction.sender_id == account_id ? transaction.receiver_id != null? "Buying Vehicle" : "Withdrawn from Balance" : transaction.receiver_id ? "Sold Vehicle" : "Deposit to Balance",
      adId: transaction.ad_id,
      adOwner: transaction.sender_id == account_id ? transaction.receiver_id != null : transaction.sender_id,
      amount: transaction.amount,
    }
  })
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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
                    <TableCell className={`text-right ${transaction.type === "Buying Vehicle"|| transaction.type === "Withdrawn from Balance" ? 'text-red-600': 'text-green-600' }`}>
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