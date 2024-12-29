import TicketForm from '@/components/layout/TicketForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function TicketPage() {

  /*const res = await fetch(`${SERVER_URL}/ad/get-ads?${queryParams}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Cookie: "Authorization=" + getAuthToken(),
      },
    });
  
  const {tickets} = await res.json()*/

  const tickets = [
    {
      id: 1,
      title: "Merhaba",
      subject: "Issue with Login",
      description: "I cannot log into my account. Please help!",
      createdAt: new Date().toISOString(),
      status: "open",
    },
    {
      id: 2,
      title: "Merhaba",
      subject: "Payment Problem",
      description: "Payment not going through for the premium plan.",
      createdAt: new Date().toISOString(),
      status: "open",
    },
    {
      id: 3,
      title: "Merhaba",
      subject: "Feature Request",
      description: "It would be great to have a dark mode for the app.",
      createdAt: new Date().toISOString(),
      status: "closed",
    },
  ];
    

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Support Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Submit a New Ticket</h2>
          <TicketForm />
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
                    <CardTitle>{ticket.title}</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{ticket.description}</p>
                    <div className="mt-2">
                      <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'in-progress' ? 'secondary' : 'outline'}>
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
  )
}

