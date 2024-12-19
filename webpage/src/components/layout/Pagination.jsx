"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Pagination({ filters, totalPages, isPending }) {
  const router = useRouter()
  
  const pushWithFilters = (updatedFilters) => {
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params.set(key, String(value))
      }
    })
    router.replace(`/?${params.toString()}`)
  }

  const handlePagination = (newPage) => {
    const newFilters = { ...filters, page: newPage }
    pushWithFilters(newFilters)
  }
  
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="outline"
        disabled={filters.page <= 1 || isPending}
        onClick={() => handlePagination(filters.page - 1)}
      >
        Previous
      </Button>
      <span>Page {filters.page} of {totalPages}</span>
      <Button
        variant="outline"
        disabled={filters.page >= totalPages || isPending}
        onClick={() => handlePagination(filters.page + 1)}
      >
        Next
      </Button>
    </div>
  )
}
