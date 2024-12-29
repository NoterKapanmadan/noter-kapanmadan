'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/hooks/use-toast"

export default function TicketForm() {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={pending}> Submit </Button>
    </form>
  )
}