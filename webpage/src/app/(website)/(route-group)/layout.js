import TabsArea from "@/components/layout/TabsArea"
import { isAuthenticated, getRecommendedAds } from "@/app/actions"
import RecommendedAds from "@/components/layout/RecommendedAds"

export default async function Layout({ children, parallel }) {
  const isAuth = await isAuthenticated()
  let finalizedAds = []
  if (isAuth) {
    const ads = await getRecommendedAds()
    finalizedAds = ads.finalizedAds

    console.log(finalizedAds)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAuth ? <RecommendedAds ads = {finalizedAds}/> : null}
        <div className="flex flex-col lg:flex-row gap-4">
          {children}
          <div className="flex-1">
            {isAuth ? <TabsArea parallel={parallel} /> : parallel}
          </div>  
        </div>
      </main>
    </div>
  )
}
