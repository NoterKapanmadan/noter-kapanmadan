import { Star } from 'lucide-react'

export default function Stars({ point }) {
  const MAX_STARS = 5

  return (
    <div className="flex items-center gap-[0.05rem]">
      {[...Array(MAX_STARS)].map((_, i) => {
        const starNumber = i + 1
        const fraction = Math.min(Math.max(point - (starNumber - 1), 0), 1)

        return (
          <div key={starNumber} className="relative w-5 h-5">
            <Star className="text-gray-300 w-5 h-5" />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fraction * 100}%` }}
            >
              <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

