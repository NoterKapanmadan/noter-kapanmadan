import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TabListClient() {
  const pathname = usePathname()
  let defaultValue = "allAds"
  if (pathname === "/deneme") {
    defaultValue = "allAds"
  } else if (pathname === "/deneme/my") {
    defaultValue = "myAds"
  } else if (pathname === "/deneme/favori") {
    defaultValue = "favorites"
  }

  return (
    <TabsList className="bg-gray-200 w-full flex *:w-full">
      <TabsTrigger value="allAds" asChild>
        <Link href="/deneme">All Ads</Link>
      </TabsTrigger>
      <TabsTrigger value="myAds" asChild>
        <Link href="/deneme/my-ads">My Ads</Link>
      </TabsTrigger>
      <TabsTrigger value="favorites" asChild>
        <Link href="/deneme/favorites">Favorites</Link>
      </TabsTrigger>
    </TabsList>
  )
}
