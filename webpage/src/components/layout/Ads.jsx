'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { getImageSrc } from '@/utils/file'
import AuthLink from '@/components/layout/AuthLink'

export default function Ads({ vehicleAds }) {
  const [filters, setFilters] = useState({
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
  })
/*
  const filteredAds = vehicleAds.filter(ad => 
    ad.title.toLowerCase().includes(filters.title.toLowerCase()) &&
    ad.price >= filters.minPrice &&
    ad.price <= filters.maxPrice &&
    (filters.date ? ad.date >= filters.date : true) &&
    ad.location.toLowerCase().includes(filters.location.toLowerCase()) &&
    ad.brand.toLowerCase().includes(filters.brand.toLowerCase()) &&
    ad.model.toLowerCase().includes(filters.model.toLowerCase()) &&
    ad.year >= filters.minYear &&
    ad.year <= filters.maxYear &&
    ad.km <= filters.maxKm &&
    (filters.gear_type ? ad.gear_type === filters.gear_type : true) &&
    (filters.fuel_type ? ad.fuel_type === filters.fuel_type : true))
*/
  const filteredAds = vehicleAds;
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar with filters */}
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={filters.title}
                    onChange={(e) => setFilters({...filters, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                      className="w-20" />
                    <span>-</span>
                    <Input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                      className="w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date From</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters({...filters, date: e.target.value})} />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={filters.model}
                    onChange={(e) => setFilters({...filters, model: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Year Range</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={filters.minYear}
                      onChange={(e) => setFilters({...filters, minYear: Number(e.target.value)})}
                      className="w-20" />
                    <span>-</span>
                    <Input
                      type="number"
                      value={filters.maxYear}
                      onChange={(e) => setFilters({...filters, maxYear: Number(e.target.value)})}
                      className="w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Max Kilometers</Label>
                  <Slider
                    min={0}
                    max={200000}
                    step={1000}
                    value={[filters.maxKm]}
                    onValueChange={(value) => setFilters({...filters, maxKm: value[0]})} />
                  <div className="text-right text-sm text-muted-foreground">{filters.maxKm} km</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gear_type">Gear Type</Label>
                  <Select onValueChange={(value) => setFilters({...filters, gear_type: value})}>
                    <SelectTrigger id="gear_type">
                      <SelectValue placeholder="Select gear type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Select onValueChange={(value) => setFilters({...filters, fuel_type: value})}>
                    <SelectTrigger id="fuel_type">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setFilters({
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
                  })}>
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* Main content area with vehicle ads */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAds.map(ad => (
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
            {filteredAds.length === 0 && (
              <p className="text-center text-muted-foreground mt-6">No vehicles found matching your criteria.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}