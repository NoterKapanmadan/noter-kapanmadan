"use client"
import React, { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";
import { revalidatePathClient } from "@/app/actions";

export default function EditTicketModal({ isOpen, ticket, onClose}) {
  const [priority, setPriority] = useState(ticket.priority)
  const [status, setStatus] = useState(ticket.status)

  const { toast } = useToast()
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/admin/update-ticket`, {
        method: 'POST',
        body: JSON.stringify({
          ticket_id: ticket.ticket_id,
          priority,
          status,
        }),
      })

      console.log(response)

      const { msg, error } = await response.json();
    
      if (error) {
        return toast({
          title: 'Something went wrong!',
          description: error,
        });
      }

      if (msg) {
        toast({
          title: 'Success!',
          description: msg,
        });
        revalidatePathClient(`/admin/tickets`);
        onClose()
      }
    })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label>Priority</Label>
            <Select defaultValue={ticket.priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </SelectItem>
                <SelectItem value="Medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="Low">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Low
                  </span>
                </SelectItem>
                <SelectItem value="Not Decided">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Not Decided
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select defaultValue={ticket.status} onValueChange={setStatus}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Open
                  </span>
                </SelectItem>
                <SelectItem value="Closed">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Closed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button disabled={pending} type="submit">Save Changes</Button>
            <Button variant="outline" disabled={pending} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}