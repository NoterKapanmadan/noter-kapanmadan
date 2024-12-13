'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import AuthLink from '@/components/layout/AuthLink'
import { getImageSrc } from '@/utils/file'
import { Calendar } from 'lucide-react'

export default function Ads({ ads, initialFilters, totalPages }) {
  const [filters, setFilters] = useState(initialFilters)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const pushWithFilters = (updatedFilters) => {
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params.set(key, String(value))
      }
    })
    router.push(`/?${params.toString()}`)
  }

  const updateFilter = (updatedFields) => {
    const newFilters = { ...filters, ...updatedFields, page: 1 }
    setFilters(newFilters)
    startTransition(() => {
      pushWithFilters(newFilters)
    })
  }

  const handlePagination = (newPage) => {
    const newFilters = { ...filters, page: newPage }
    setFilters(newFilters)
    startTransition(() => {
      pushWithFilters(newFilters)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newFilters = {
      title: formData.get('title') || '',
      minPrice: Number(formData.get('minPrice')) || 0,
      maxPrice: Number(formData.get('maxPrice')) || 50000,
      date: formData.get('date') || '',
      location: formData.get('location') || '',
      brand: formData.get('brand') || '',
      model: formData.get('model') || '',
      minYear: Number(formData.get('minYear')) || 2000,
      maxYear: Number(formData.get('maxYear')) || 2023,
      maxKm: Number(formData.get('maxKm')) || 100000,
      gear_type: formData.get('gear_type') || '',
      fuel_type: formData.get('fuel_type') || '',
    }

    updateFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      title: '',
      minPrice: 0,
      maxPrice: 50000,
      date: '',
      location: '',
      brand: '',
      model: '',
      minYear: 2000,
      maxYear: 2023,
      maxKm: 100000,
      gear_type: '',
      fuel_type: '',
    }
    setFilters(resetFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-80 space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-4">
                <AuthLink href="/add-ad">
                  <Button className="w-full">
                    Create Add
                  </Button>
                </AuthLink>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={filters.title}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        name="minPrice"
                        defaultValue={filters.minPrice}
                        className="w-20"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        name="maxPrice"
                        defaultValue={filters.maxPrice}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date From</Label>
                    <div className="relative">
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={filters.date}
                      />
                      <Calendar
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={filters.location}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      defaultValue={filters.brand}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      name="model"
                      defaultValue={filters.model}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year Range</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        name="minYear"
                        defaultValue={filters.minYear}
                        className="w-20"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        name="maxYear"
                        defaultValue={filters.maxYear}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxKm">Max Kilometers</Label>
                    <input
                      type="range"
                      name="maxKm"
                      min="0"
                      max="200000"
                      step="1000"
                      defaultValue={filters.maxKm}
                      className="w-full"
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {filters.maxKm} km
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gear_type">Gear Type</Label>
                    <select name="gear_type" id="gear_type" defaultValue={filters.gear_type || ''} className="w-full border rounded p-2">
                      <option value="">Any</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel_type">Fuel Type</Label>
                    <select name="fuel_type" id="fuel_type" defaultValue={filters.fuel_type || ''} className="w-full border rounded p-2">
                      <option value="">Any</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit">Apply Filters</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset Filters
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          {/* Main content area with vehicle ads */}
          <div className="flex-1">
            {isPending && <p className="text-center text-sm text-muted-foreground mb-2">Loading...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ads.map(ad => (
                <Card key={ad.ad_id} className="flex flex-col">
                  <CardHeader className="p-3">
                    { ad.images ?
                      <Image
                        src={getImageSrc(ad.images[0], 'medium_resized')}
                        alt={ad.title}
                        width={800}
                        height={500}
                        blurDataURL={ad.base64Image}
                        placeholder= {ad.base64Image ? "blur": "empty"}
                        className="w-[19rem] h-48 object-cover rounded-lg" />
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
                      <Link href={`/ad/${ad.ad_id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {ads.length === 0 && (
              <p className="text-center text-muted-foreground mt-6">No vehicles found matching your criteria.</p>
            )}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={filters.page <= 1 || isPending}
                onClick={() => handlePagination(filters.page - 1)}
              >
                Previous
              </Button>
              <span>Page {filters.page} of {totalPages}</span>
              <Button
                variant="outline"
                disabled={filters.page >= totalPages || isPending}
                onClick={() => handlePagination(filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}