import Ads from "@/components/layout/Ads";
import { SERVER_URL } from "@/utils/constants"
import { getAuthToken } from "@/lib/auth";

export default async function HomePage({ searchParams }) {
  const {
    title = '',
    minPrice = '0',
    maxPrice = '50000',
    date = '',
    location = '',
    brand = '',
    model = '',
    minYear = '2000',
    maxYear = '2023',
    maxKm = '100000',
    gear_type = '',
    fuel_type = '',
    page = '1'
  } = searchParams

  const filters = {
    title,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    date,
    location,
    brand,
    model,
    minYear: Number(minYear),
    maxYear: Number(maxYear),
    maxKm: Number(maxKm),
    gear_type,
    fuel_type,
    page: Number(page)
  }

  const queryParams = new URLSearchParams(searchParams)

  const { vehicleAds, totalPages } = await fetch(`${SERVER_URL}/ad/get-ads?${queryParams}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  return (
      <Ads
      ads={vehicleAds || []}
      initialFilters={filters}
      totalPages={totalPages}
    />
  );
}