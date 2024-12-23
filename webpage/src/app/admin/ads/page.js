'use client'

import { useState, useEffect, useTransition } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {CircleX} from 'lucide-react'

export default function Ads() {
  const [ads, setAds] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [transitioningAd, setTransitioningAd] = useState(null)
  const [pending, startTransition] = useTransition()

  const fetchAds = async () => {
    const response = await fetch(`/api/admin/get-ads?searchKey=${search}`)

    if (response.ok) {
      const data =  await response.json()
      setAds(data)
      setLoading(false)
      console.log(data)
    }
  }
  useEffect(() => { 
    fetchAds()
  } , [])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAds()
    }, 120);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const changeAdStatus = async (adId, newStatus) => {
    setTransitioningAd(adId)
    startTransition(async () => {
      const response = await fetch(`/api/admin/ban-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adId, status: newStatus })
      })
  
      if (response.ok) {
        fetchAds()
      }
    })

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
      {loading ? (
        <div className="font-medium text-center">Loading...</div>
      ) : (
      <div className="flex flex-col gap-2">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex items-center p-4">
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Link className="hover:underline" href={`/ad/${ad.id}`} target="_blank">
                      {ad.title}
                    </Link>
                    <Badge variant={ad.status === 'active' ? 'default' : ad.status === 'inactive' ? 'secondary' : 'outline'}>
                      {ad.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-500">ID: {' '}
                    <Link className="text-blue-500 hover:underline" href={`/ad/${ad.id}`} target="_blank">
                      {ad.id}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            {ad.status === 'active' || ad.status === 'inactive'? <div>
              <Button
                  onClick={() => changeAdStatus(ad.id, ad.status === 'active' ? 'inactive' : 'active')}
                  variant={ad.status === 'active' ? 'destructive' : 'default'}
                  className="h-8"
                  disabled={pending && transitioningAd === ad.id}
                > 
                  {ad.status === 'active' ? (<CircleX size={20} />) : <CircleX size={20} />}
                  {ad.status === 'active' ? 'Ban' : 'Unban'}
                </Button>
            </div> : null}
          </Card>
        ))}
      </div>)}
    </div>
  )
}

