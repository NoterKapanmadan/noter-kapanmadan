
import TabsArea from "@/components/layout/TabsArea"
import { isAuthenticated } from "@/app/actions"

export default async function Layout({ children, parallel }) {
  const isAuth = await isAuthenticated()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          { children }
          <div className="flex-1">
            {isAuth ? <TabsArea parallel={parallel} /> : parallel}
          </div>  
        </div>
      </main>
    </div>
  )
}
