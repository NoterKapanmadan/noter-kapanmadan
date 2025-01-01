import { getBrands } from "@/app/actions"
import AdFilters from "@/components/layout/AdFilters"

export default async function HomePageParallel({ searchParams }) {
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

  const {
    sortBy = '',
    order = ''
  } = searchParams

  const sort = {
    sortBy,
    order
  } 

  const brands = await getBrands();


  return (
    <AdFilters initialSort={sort} initialFilters={filters} brands={brands}/>
  )
}