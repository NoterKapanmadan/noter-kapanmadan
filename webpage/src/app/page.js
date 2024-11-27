import VehicleMarketplace from "@/components/layout/HomePage";
import { getRandomCars } from "@/utils/placeholderCar";

export default async function HomePage() {
  let vehicleAds = await getRandomCars();
  return (
    <>
      <VehicleMarketplace vehicleAds={vehicleAds} />
    </>
  );
}