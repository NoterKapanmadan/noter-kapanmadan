'use client'

import { useTransition, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";


export default function TicketForm() {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition();

  const formRef = useRef(null)

  const router = useRouter();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/admin/send-ticket`, {
        method: 'POST',
        body: formData,
      })

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
        formRef.current.reset()
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          type="text"
          id="subject"
          name="subject"
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