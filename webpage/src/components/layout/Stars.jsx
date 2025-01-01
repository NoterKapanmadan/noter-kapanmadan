import { Star } from 'lucide-react'

export default function Stars({ point }) {
  return (
    <div className="flex items-center gap-[0.06rem]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= point ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div> 
  )
}
