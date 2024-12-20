'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, BarChart2, FileText, DollarSign, MessageSquare, LogOut, ArrowLeft } from 'lucide-react'
import { logout } from '@/app/actions'

const menuItems = [
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Ads', icon: BarChart2, href: '/admin/ads' },
  { name: 'Transactions', icon: DollarSign, href: '/admin/transactions' },
  { name: 'Statistics', icon: FileText, href: '/admin/statistics' },
  { name: 'User Requests', icon: MessageSquare, href: '/admin/requests' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-2">
      <p className="text-center font-bold text-xl">Admin Panel</p>
      <nav className='flex-1 flex flex-col gap-1'>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center py-2 gap-2 text-base leading-6 font-medium hover:text-black text-gray-500"
          >
            <item.icon className="h-5 w-5 text-gray-500 group-hover:text-black" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-3 text-gray-500">
        <Link href="/" className="group hover:text-black flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 group-hover:text-black" />
          Back to website
        </Link>
        <form action={logout}>
          <button className="w-full flex items-center gap-2 group hover:text-black">
            <LogOut className="h-5 w-5 group-hover:text-black" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}

