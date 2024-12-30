"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { getImageSrc } from "@/utils/file"
import { formatDate } from "@/utils/date"
import EditTicketModal from "@/components/layout/EditTicketModal"

export default function TicketsPageClient({ tickets }) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket)
    setEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setSelectedTicket(null)
    setEditModalOpen(false)
  }

  return (
    <>
      <div className="rounded-lg border bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
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
                <TableCell className="font-medium">
                  #{ticket.ticket_id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={getImageSrc(ticket.profile_image)}
                      alt={ticket.forename}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>
                      {ticket.forename} {ticket.surname}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      ticket.priority === "High" &&
                        "bg-red-100 text-red-700",
                      ticket.priority === "Medium" &&
                        "bg-orange-100 text-orange-700",
                      ticket.priority === "Low" &&
                        "bg-blue-100 text-blue-700"
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditClick(ticket)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editModalOpen && selectedTicket && (
        <EditTicketModal
          isOpen={editModalOpen}
          ticket={selectedTicket}
          onClose={handleEditModalClose}
        />
      )}
    </>
  )
}