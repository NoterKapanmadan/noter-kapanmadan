import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoadingSkeleton() {
  const getRandomArray = (n) => {
    const length = Math.floor(Math.random() * n) + 1
    return Array.from({ length }, (_, i) => i + 1)
  }

  const randomArray = getRandomArray(3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {randomArray.map((key) => (
        <Card className="flex flex-col">
          <CardHeader className="p-3">
            <Skeleton className="w-64 h-48 rounded-lg" />
          </CardHeader>
          <CardContent className="flex-grow p-3">
            <Skeleton className="w-4/5 h-6 rounded-lg mb-2" />
            <Skeleton className="w-full h-32 rounded-lg" />
          </CardContent>
          <CardFooter className="p-3">
            <Skeleton className="w-full h-10 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
