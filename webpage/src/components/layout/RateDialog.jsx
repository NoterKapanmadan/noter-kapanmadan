'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SERVER_URL } from '@/utils/constants'
import { useToast } from '@/hooks/use-toast'
import { revalidateTagClient } from '@/app/actions'

export function StarRating({ rating, onRatingChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  )
}

export default function RateDialog({ offer }) {
  const [rating, setRating] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const res = await fetch(`${SERVER_URL}/rating/add-rating`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evaluated_id: offer.owner_id,
          comment: formData.get("comment"),
          point: rating,
        })
      })
  
      const { message } = await res.json()
  
      if (res.ok) {
        toast({
          title: "Success!",
          description: message,
        });
        revalidateTagClient("offers")
        setIsOpen(false)
      } else {
        toast({
          title: "Error!",
          description: message,
        });
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge className="cursor-pointer flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600">
          <Star size={14} />
          Rate
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate</DialogTitle>
          <DialogDescription>
            How was your experience with {`${offer.bidder_forename} ${offer.bidder_surname}`}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <Label>Rating</Label>
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Comment</Label>
              <Textarea name="comment" placeholder="Leave a comment..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

