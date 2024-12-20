import AllAds from "@/components/layout/AllAds"
import { Suspense } from "react"
import LoadingSkeleton from "@/components/layout/LoadingSkeleton"

export default function AllAdsParallel({ searchParams }) {
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
      <AllAds filters={filters} />
    </Suspense>
  )
}
