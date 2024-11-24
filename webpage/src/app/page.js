import VehicleMarketplace from "@/components/layout/HomePage";
import { getRandomCars } from "@/utils/placeholderCar";
import { query } from "@/lib/db";

export default async function HomePage() {
  let vehicleAds = await getRandomCars();
  console.log(vehicleAds);
  
  try {
    const result = await query('SELECT NOW()');
    console.log('Connection successful:', result.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error);
  }

  return(<VehicleMarketplace vehicleAds={vehicleAds}/>);
}