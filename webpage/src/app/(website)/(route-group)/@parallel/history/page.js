import { Suspense } from "react"
import LoadingSkeleton from "@/components/layout/LoadingSkeleton"
import RecentVisitedAds from "@/components/layout/RecentVisitedAds"


export default function HistoryParallel({ searchParams }) {
  const {
    title = '',
    minPrice = '',
    maxPrice = '',
    date = '',
    location = '',
    brand = '',
    model = '',
    minYear = '',
    maxYear = '',
    maxKm = '',
    gear_type = '',
    fuel_type = '',
    latitude = '',
    longitude = '',
    maxDistance = '',
    page = '1'
  } = searchParams

  const filters = {
    title,
    minPrice,
    maxPrice,
    date,
    location,
    brand,
    model,
    minYear,
    maxYear,
    maxKm,
    gear_type,
    fuel_type,
    latitude,
    longitude,
    maxDistance,
    page: Number(page),
  }
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RecentVisitedAds filters={filters} />
    </Suspense>
  )
}
