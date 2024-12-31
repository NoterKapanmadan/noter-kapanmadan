'use client'
import React, { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";
import { revalidatePathClient } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check } from 'lucide-react'

/**
 * @typedef {Object} Ticket
 * @property {string} ticket_id
 * @property {'Low' | 'Medium' | 'High' | 'Not Decided'} priority
 * @property {'Open' | 'Closed'} status
 */

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Ticket} props.ticket
 * @param {Function} props.onClose
 */
export default function EditTicketModal({ isOpen, ticket, onClose }) {
  const [priority, setPriority] = useState(ticket.priority)
  const [status, setStatus] = useState(ticket.status)

  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent default form submission
    startTransition(async () => {
      try {
        const response = await fetch(`${SERVER_URL}/admin/update-ticket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticket_id: ticket.ticket_id,
            priority,
            status,
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

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
      } catch (err) {
        console.error(err)
        toast({
          title: 'An unexpected error occurred!',
          description: 'Please try again later.',
        });
      }
    })
  }

  if (!isOpen) return null

  // Helper functions to get styling based on priority and status
  const getPriorityStyles = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-700'
      case 'Medium':
        return 'bg-orange-100 text-orange-700'
      case 'Low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusStyles = (state) => {
    switch (state) {
      case 'Open':
        return 'bg-green-100 text-green-700'
      case 'Closed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Priority Selection */}
          <div>
            <Label>Priority</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`w-full justify-between ${getPriorityStyles(priority)} mt-1`}>
                  {priority} Priority
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriority('High')}>
                  <Check className={`mr-2 h-4 w-4 ${priority === 'High' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    High
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriority('Medium')}>
                  <Check className={`mr-2 h-4 w-4 ${priority === 'Medium' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                    Medium
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriority('Low')}>
                  <Check className={`mr-2 h-4 w-4 ${priority === 'Low' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    Low
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriority('Not Decided')}>
                  <Check className={`mr-2 h-4 w-4 ${priority === 'Not Decided' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    Not Decided
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Selection */}
          <div>
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`w-full justify-between ${getStatusStyles(status)} mt-1`}>
                  {status}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatus('Open')}>
                  <Check className={`mr-2 h-4 w-4 ${status === 'Open' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    Open
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus('Closed')}>
                  <Check className={`mr-2 h-4 w-4 ${status === 'Closed' ? 'opacity-100' : 'opacity-0'}`} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    Closed
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button disabled={pending} type="submit">
              {pending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" disabled={pending} type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}