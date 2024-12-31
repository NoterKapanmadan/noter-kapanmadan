'use client'

import { useState } from 'react';
import { ArrowLeft, Check, ChevronDown, Clock, User } from 'lucide-react';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PropTypes from 'prop-types';
import { getImageSrc } from '@/utils/file';
import { formatDate } from '@/utils/date';

export default function TicketDetailsClient({ ticket }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [isChanged, setIsChanged] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [newPriority, setNewPriority] = useState(ticket.priority);

  const handleStatusChange = (updatedStatus) => {
    setNewStatus(updatedStatus);
    setIsChanged(true);
  };

  const handlePriorityChange = (updatedPriority) => {
    setNewPriority(updatedPriority);
    setIsChanged(true);
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tickets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Ticket Details</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{ticket.subject}</h2>
                <p className="text-sm text-muted-foreground">Ticket ID: {ticket.ticket_id}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`text-sm ${
                        newStatus === 'Open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {newStatus}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange('Open')}>
                      <Check className={`mr-2 h-4 w-4 ${newStatus === 'Open' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        Open
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('Closed')}>
                      <Check className={`mr-2 h-4 w-4 ${newStatus === 'Closed' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        Closed
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Priority Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`text-sm ${
                        newPriority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : newPriority === 'Medium'
                          ? 'bg-orange-100 text-orange-700'
                          : newPriority === 'Low'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {newPriority}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handlePriorityChange('Not Decided')}>
                      <Check className={`mr-2 h-4 w-4 ${newPriority === 'Not Decided' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        Not Decided
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange('Low')}>
                      <Check className={`mr-2 h-4 w-4 ${newPriority === 'Low' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        Low
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange('Medium')}>
                      <Check className={`mr-2 h-4 w-4 ${newPriority === 'Medium' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                        Medium
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange('High')}>
                      <Check className={`mr-2 h-4 w-4 ${newPriority === 'High' ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        High
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Save Changes Button */}
                <Button
                  disabled={!isChanged}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getImageSrc(ticket.profile_image)} />
                  <AvatarFallback>{ticket.forename}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{ticket.forename} {ticket.surname}</p>
                  <p className="text-xs text-muted-foreground">Requester</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDate(ticket.created_date)}</p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}