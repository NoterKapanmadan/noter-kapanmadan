import TicketForm from '@/components/layout/TicketForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SERVER_URL } from "@/utils/constants";
import { getAuthToken } from "@/lib/auth";
import { formatDate } from "@/utils/date";
import { revalidatePathClient } from "@/app/actions";
import { cn } from "@/lib/utils"

export default async function TicketPage() {

  const res = await fetch(`${SERVER_URL}/admin/get-user-ticket`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Cookie: "Authorization=" + getAuthToken(),
      },
    });
  
  const {tickets} = await res.json()

  return (
    <div className="bg-gray-50">
      <div className="container py-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Support Tickets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  Submit a New Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TicketForm />
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Existing Tickets</h2>
              {tickets.length === 0 ? (
                <p>No tickets submitted yet.</p>
              ) : (
                tickets.map((ticket) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{ticket.subject}</CardTitle>
                      <CardDescription>
                        Submitted on {formatDate(new Date(ticket.created_date))}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{ticket.description}</p>
                      <div className="mt-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            ticket.status === "Open" &&
                              "bg-green-100 text-green-700",
                            ticket.status === "Closed" &&
                              "bg-gray-100 text-gray-700"
                          )}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

