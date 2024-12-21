'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const mockAds = [
  { id: '1', title: 'Summer Sale', status: 'active' },
  { id: '2', title: 'New Product Launch', status: 'pending' },
  { id: '3', title: 'Holiday Special', status: 'inactive' },
]

export default function Ads() {
  const [ads, setAds] = useState(mockAds)
  const [search, setSearch] = useState('')

  const changeAdStatus = (adId, newStatus) => {
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, status: newStatus } : ad
    ))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ads</h1>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by ID or title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex flex-col gap-2">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex items-center p-4">
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {ad.title}
                    <Badge variant={ad.status === 'active' ? 'default' : ad.status === 'inactive' ? 'secondary' : 'outline'}>
                      {ad.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-500">ID: {ad.id}</p>
                </div>
              </div>
            </div>
            <div>
              <Select
                value={ad.status}
                onValueChange={(value) => changeAdStatus(ad.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

