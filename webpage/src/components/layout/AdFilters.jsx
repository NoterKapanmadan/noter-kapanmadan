'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from 'lucide-react'
import PlaceAutocomplete from './PlaceAutocomplete'
import AuthLink from '@/components/layout/AuthLink'
import { getModels } from '@/app/actions'
import { set } from 'date-fns'

export default function AdFilters({ initialSort, initialFilters, brands }) {
  const [filters, setFilters] = useState(initialFilters)
  const [sort, setSort] = useState(initialSort)
  const formRef = useRef(null)

  const [fuelType, setFuelType] = useState(filters.fuel_type || '')
  const [gearType, setGearType] = useState(filters.gear_type || '')
  const [brand, setBrand] = useState(filters.brand || '')
  const [model, setModel] = useState(filters.model || '')

  const [autocompleteKey, setAutocompleteKey] = useState(Date.now());

  const [models, setModels] = useState([])

  const router = useRouter()
  const pathname = usePathname()


  const pushWithFilters = (updatedFilters) => {
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params.set(key, String(value))
      }
    })
    router.replace(`${pathname}?${params.toString()}`)
  }

  const updateFilter = (updatedFields) => {
    const newFilters = { ...filters, ...updatedFields, page: 1 }
    setFilters(newFilters)
  }

  const updateSort = (updatedFields) => {
    const newSort = { ...sort, ...updatedFields }
    setSort(newSort)
  }

  const handleSubmit = (formData) => {
    const newFilters = {}
    for (const pair of formData) {
      newFilters[pair[0]] = pair[1];
    }

    newFilters["gear_type"] = gearType
    newFilters["fuel_type"] = fuelType
    newFilters["brand"] = brand
    newFilters["model"] = model

    updateFilter(newFilters)
    pushWithFilters({ ...newFilters, ...sort})
  }

  const handleBrandChange = async (value) => {
    setBrand(value)
    setModel('')
    setModels([])
    const newModels = await getModels(value);
    setModels(newModels)
  }

  const handleReset = () => {
    const resetFilters = {
      title: '',
      minPrice: '',
      maxPrice: '',
      date: '',
      location: '',
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      maxKm: '',
      gear_type: '',
      fuel_type: '',
      maxDistance: '',
      latitude: '',
      longitude: '',
    }

    updateFilter(resetFilters)
    pushWithFilters({ ...resetFilters, ...sort })
    setFuelType('')
    setGearType('')
    setBrand('')
    setModel('')

    setModels([])

    formRef.current.reset()
    setAutocompleteKey(Date.now()); // reset autocomplete component by changing key
  }

  const handleSortBySelectChange = (value) => {
    const newValue = value == "date" ? '' : value
    
    updateSort({ "sortBy": newValue })
    console.log(sort)
    pushWithFilters({ ...filters, ...sort, sortBy: newValue })
  }

  const handleOrderSelectChange = (value) => {
    const newValue = value == "desc" ? '' : value
    
    updateSort({ "order": newValue })
    console.log(sort)
    pushWithFilters({ ...filters, ...sort, order: newValue })
  }

  return (
    <div className="w-full lg:w-80 space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <AuthLink href="/add-ad">
           <Button className="w-full">
              Create Ad
            </Button>
          </AuthLink>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold text-2xl">Sort</p>
          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort By</Label>
            <Select
              name="sort-by"
              id="sort-by"
              defaultValue={initialSort.sortBy || "date"}
              onValueChange={(value) => handleSortBySelectChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="km">Kilometers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Select
              name="order"
              id="order"
              defaultValue={initialSort.order || "desc"}
              onValueChange={(value) => handleOrderSelectChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <form ref={formRef} action={handleSubmit}>
          <CardContent className="space-y-4">
            <p className="font-semibold text-2xl">Filters</p>
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
                  min="0"
                  name="minPrice"
                  defaultValue={filters.minPrice}
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  min="0"
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
              <PlaceAutocomplete isFilter key={autocompleteKey}/>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                name="brand"
                id="brand"
                value={brand}
                onValueChange={(value) => handleBrandChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => 
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                name="model"
                id="model"
                value={model}
                disabled={models.length === 0 || models == null}
                onValueChange={(value) => setModel(value)}
                >
                <SelectTrigger>
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {models && models.map((model) => 
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year Range</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="0"
                  name="minYear"
                  defaultValue={filters.minYear}
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  min="0"
                  name="maxYear"
                  defaultValue={filters.maxYear}
                  className="w-20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Kilometers</Label>
              <Slider
                min={0}
                max={500000}
                step={1000}
                defaultValue={[filters.maxKm]}
                onValueChange={(value) => setFilters({ ...filters, maxKm: value[0] })} />
              <div className="text-right text-sm text-muted-foreground">{filters.maxKm} km</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gear_type">Gear Type</Label>
              <Select
                name="gear_type"
                id="gear_type"
                value={gearType}
                onValueChange={(value) => setGearType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Gear Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select
                name="fuel_type"
                id="fuel_type"
                value={fuelType}
                onValueChange={(value) => setFuelType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 *:w-full">
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
  );
}