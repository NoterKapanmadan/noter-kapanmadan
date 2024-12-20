import Sidebar from "@/components/layout/Sidebar";
import { isAdmin } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function AdminLayout({ children }) {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return notFound()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 -y-auto p-8">
        {children}
      </main>
    </div>
  )
}