import Favorites from "@/components/layout/Favorites"
import { Suspense } from "react"
import LoadingSkeleton from "@/components/layout/LoadingSkeleton"

export default function FavoritesParallel({ searchParams }) {
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
      <Favorites filters={filters} />
    </Suspense>
  )
}
