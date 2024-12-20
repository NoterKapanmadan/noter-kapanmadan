import Ads from "@/components/layout/Ads";
import Pagination from "./Pagination";
import { SERVER_URL } from "@/utils/constants"
import { getAuthToken } from "@/lib/auth";

export default async function AllAds({ filters }) {
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

  return (
    <>
      <Ads
        ads={vehicleAds}
        initialFilters={filters}
        totalPages={totalPages}
      />
      {totalPages > 1 && <Pagination filters={filters} totalPages={totalPages} />}
    </>
  );
}