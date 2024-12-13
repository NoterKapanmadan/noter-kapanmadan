"use client"
import { Check, CircleDollarSign, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { revalidateTagClient } from '@/app/actions'
import { useToast } from '@/hooks/use-toast'
import { SERVER_URL } from '@/utils/constants'
import { useTransition } from "react"

export default function OfferActions({ bid_ID }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const acceptOffer = async (bid_ID) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/offer/evaluate-offer`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bid_ID, action: 'accept' }),
      });
    
      if (response.ok) {
        revalidateTagClient("offers")
      } else {
        toast({
          title: 'Something went wrong!',
          description: response.message,
        });
      }
    })
  }
  
  const rejectOffer = async (bid_ID) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/offer/evaluate-offer`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bid_ID, action: 'reject' }),
      });
    
      if (response.ok) {
        revalidateTagClient("offers")
      } else {
        toast({
          title: 'Something went wrong!',
          description: response.message,
        });
      }
    })
  }

  return (
    <div className="flex w-full justify-between *:w-full gap-2">
      <Button onClick={() => acceptOffer(bid_ID)} disabled={pending}>
          <Check className="mr-2 h-4 w-4" /> Accept
      </Button>
      <Button variant="outline" onClick={() => rejectOffer(bid_ID)} disabled={pending}>
        <X className="mr-2 h-4 w-4" /> Reject
      </Button>
    </div>
  )
}
