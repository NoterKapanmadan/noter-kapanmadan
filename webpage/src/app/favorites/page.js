// This is a server component (no "use client" directive)
import Favorites from "@/components/layout/FavoritesPage";
import { getRandomCars } from "@/utils/placeholderCar";

export default async function FavoriteCarsPage() {
  const favorites = await getRandomCars();

  return <Favorites favorites={favorites} />;
}
