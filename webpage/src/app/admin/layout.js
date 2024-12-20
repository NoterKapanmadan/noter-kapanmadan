import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster"


export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 -y-auto p-8">
            {children}
          </main>
          <Toaster />

        </div>
      )
}