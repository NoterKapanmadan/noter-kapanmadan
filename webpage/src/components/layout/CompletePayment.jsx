"use client"
import { CircleDollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { revalidateTagClient } from '@/app/actions'
import { useToast } from '@/hooks/use-toast'
import { SERVER_URL } from '@/utils/constants'
import { useTransition } from "react"

export default function CompletePayment({ bid_ID }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const completePayment = async (bid_ID) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/offer/complete-payment`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bid_ID }),
      });

      const { message } = await response.json();

      if (response.ok) {
        revalidateTagClient("offers")
      } else {
        toast({
          title: 'Something went wrong!',
          description: message,
        });
      }
    })
  }

  return (
    <div className="flex w-full justify-between items-end gap-2">
      <Button className="w-full" onClick={() => completePayment(bid_ID)} disabled={pending}>
        <CircleDollarSign className="mr-2 h-4 w-4"/> Complete Payment
      </Button>
    </div>
  )
}