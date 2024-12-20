import Ads from "@/components/layout/Ads";
import { SERVER_URL } from "@/utils/constants"
import { getAuthToken } from "@/lib/auth";
import { isAdmin} from "@/app/actions";

export default async function HomePage({ searchParams }) {
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

  const filteredFilters = {};
  
  for (const key of Object.keys(filters)) {
    if (filters[key]) {
      filteredFilters[key] = filters[key]
    }
  }
  
  const queryParams = new URLSearchParams(filteredFilters)

  const res = await fetch(`${SERVER_URL}/ad/get-ads?${queryParams}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const {vehicleAds, totalPages} = await res.json()

  // console.log("vehicleAds: ", vehicleAds, totalPages)
  const admin = await isAdmin();
  console.log("User is admin: ", admin);
  return (
    <Ads
      ads={vehicleAds}
      initialFilters={filters}
      totalPages={totalPages}
    />
  );
}