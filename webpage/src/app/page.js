import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AllAds from "@/components/layout/AllAds";
import AdFilters from "@/components/layout/AdFilters";
import { isAuthenticated } from "@/app/actions";

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

  const isAuth = await isAuthenticated()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <AdFilters initialFilters={filters} />
          <div className="flex-1">
            <Tabs defaultValue="allAds">
              <TabsList className="bg-gray-200 w-full flex *:w-full">
                <TabsTrigger value="allAds">All Ads</TabsTrigger>
                {isAuth && (
                  <>
                    <TabsTrigger value="myAds">My Ads</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  </>
                )}  
              </TabsList>
              <TabsContent value="allAds">
                <AllAds filters={filters} />
              </TabsContent>
              {isAuth && (
                <>
                  <TabsContent value="myAds">My Ads</TabsContent>
                  <TabsContent value="favorites">Favorites</TabsContent>
                </>
              )}  
            </Tabs>
          </div>  
        </div>
      </main>
    </div>
  );
}