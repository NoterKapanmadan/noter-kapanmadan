import VehicleMarketplace from "@/components/layout/HomePage";
import { SERVER_URL } from "@/utils/constants"

export default async function HomePage() {
  const ads = await fetch(`${SERVER_URL}/ad/get-ads`, {
    method: 'GET',
  })
  //Get images as well
  const results = await ads.json();
  console.log(results);
  return (
    <>
      <VehicleMarketplace vehicleAds={results} />
    </>
  );
}