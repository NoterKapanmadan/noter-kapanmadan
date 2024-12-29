import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal, Lock, Mail, Trash2, CircleDot } from 'lucide-react'
import { cn } from "@/lib/utils"
import { SERVER_URL } from "@/utils/constants";
import { getAuthToken } from "@/lib/auth";
import { getImageSrc } from '@/utils/file';
import { formatDate } from "@/utils/date"

export default async function TicketsPage() {
  const res = await fetch(`${SERVER_URL}/admin/get-all-tickets`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Cookie: "Authorization=" + getAuthToken(),
      },
    });
  
  const {stats, tickets} = await res.json()


  const statsArray = [
    {
      id: 1,
      name: 'Total Tickets',
      value: stats.totalTickets?.toString() ?? '0',
      icon: CircleDot,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      name: 'Pending Tickets',
      value: stats.pendingTickets?.toString() ?? '0',
      icon: Mail,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 3,
      name: 'Closed Tickets',
      value: stats.closedTickets?.toString() ?? '0',
      icon: Lock,
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Tickets</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statsArray.map((stat) => (
            <div
              key={stat.id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  ID
                </TableHead>
                <TableHead>Request by</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Create Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.ticket_id}>
                  <TableCell className="font-medium">#{ticket.ticket_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        src={getImageSrc(ticket.profile_image)}
                        alt={ticket.forename}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{ticket.forename}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        ticket.priority === 'High' && 'bg-red-100 text-red-700',
                        ticket.priority === 'Medium' && 'bg-orange-100 text-orange-700',
                        ticket.priority === 'Low' && 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        ticket.status === 'Open' && 'bg-green-100 text-green-700',
                        ticket.status === 'Closed' && 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(ticket.created_date)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}

