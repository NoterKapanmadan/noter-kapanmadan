import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="justify-center p-4 flex flex-col items-center gap-1">
        <h2 className="font-bold text-2xl">404 - Page Not Found</h2>
        <Link href="/" className="text-blue-600 hover:underline">Go to homepage</Link>
      </div>
    </div>
  )
}
