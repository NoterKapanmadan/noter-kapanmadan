
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getImageSrc } from '@/utils/file'
import Link from 'next/link'
import { logout } from '@/app/actions'

export default function RecentVisitedAds({ vehicleAds }) {
  const [order, setOrder] = useState('latest')

  const sortedAds = [...vehicleAds].sort((a, b) => {
    if (order === 'latest') {
      return new Date(b.date) - new Date(a.date)
    } else {
      return new Date(a.date) - new Date(b.date)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span
            className="text-red-400 cursor-pointer"
            onClick={async () => {
              await logout();
            }}
          >
            Logout
          </span>
          <h1 className="text-xl font-bold">NoterKapanmadan</h1>
          <Link href="/add-ad">
            <Button variant = "primary">create-ad</Button>
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Order selection */}
          <div className="flex justify-end">
            <Select onValueChange={(value) => setOrder(value)} defaultValue="latest">
              <SelectTrigger>
                <SelectValue placeholder="Order by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Vehicle ads */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedAds.map(ad => (
              <Card key={ad.ad_id} className="flex flex-col">
                <CardHeader className="p-3">
                  { ad.images ?
                    <Image
                    src={getImageSrc(ad.images[0], 'medium_resized')}
                    alt={ad.title}
                    width={667}
                    height={500}
                    blurDataURL={ad.base64Image}
                    placeholder= {ad.base64Image ? "blur": "empty"}
                    className="max-w-64 w-64 h-48 object-cover rounded-lg" />
                    :
                    <div className="w-full h-48 bg-gray-300 rounded-lg" />
                    }
                </CardHeader>
                <CardContent className="flex-grow p-3">
                  <CardTitle className="mb-2">{ad.title}</CardTitle>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">${ad.price}</p>
                    <p className="text-sm text-muted-foreground">{ad.location} - {ad.date}</p>
                    <p className="text-sm">{ad.year} - {ad.km} km</p>
                    <p className="text-sm">{ad.gear_type} - {ad.fuel_type}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-3">
                  <Button className="w-full" asChild>
                    <Link href={ad.ad_id}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          </div>
          {sortedAds.length === 0 && (
            <p className="text-center text-muted-foreground mt-6">No vehicles found.</p>
          )}
        </div>
      </main>
    </div>
  )
}