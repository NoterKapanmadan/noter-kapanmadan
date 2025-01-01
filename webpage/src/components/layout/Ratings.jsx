"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Stars from "@/components/layout/Stars"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/utils/date"

export default function Ratings({ fullname, ratings }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1">
          <Stars point={ratings.average_rating} />
          <span className="cursor-pointer text-sm text-blue-600 hover:underline">{ratings.evaluations.length} Comments</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Comments of {fullname}</DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-0-5">
            <span className="text-black font-semibold text-lg">Average</span>
            <div className="flex items-center gap-1">
              <Stars point={ratings.average_rating} />
              <span className="font-semibold text-sm">{(+ratings.average_rating).toFixed(1)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
          {ratings.evaluations.length > 0 ? ratings.evaluations.map((evaluation, index) => (
            <div className="grid gap-4 py-4 max-h-80 overflow-scroll">
              {index > 0 && <hr />}
              <div key={evaluation.comment_date} className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <Stars point={evaluation.point} />
                  <span className="text-sm">{evaluation.comment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="border">
                    <AvatarImage 
                      className="object-cover"
                      src={evaluation.evaluator_profile_image || "/avatar.png"}  
                    />
                  </Avatar>
                  <span className="text-sm text-gray-500">{evaluation.evaluator_forename} {evaluation.evaluator_surname}, {formatDate(evaluation.comment_date)}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-sm">
              No commnets!
            </div>
          )}
      </DialogContent>
    </Dialog>
  )
}
