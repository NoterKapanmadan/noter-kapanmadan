'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, BarChart2, FileText, DollarSign, MessageSquare } from 'lucide-react'

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
    <aside className="w-64 bg-white shadow-md">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150 ${
              pathname === item.href ? 'text-gray-900 bg-gray-100' : 'text-gray-600'
            }`}
          >
            <item.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

