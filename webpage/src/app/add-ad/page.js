"use client"

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SERVER_URL } from "@/utils/constants"
import { useToast } from "@/hooks/use-toast"


export default function AddAd() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    vehicleType: 'car',
    title: '',
    price: '',
    brand: '',
    model: '',
    year: '',
    km: '',
    gear_type: '',
    fuel_type: '',
    description: '',
    location: '',
    images: [],
    report: null,
    // Additional fields for specific vehicle types
    seatCount: '',
    bodyType: '',
    loadCapacity: '',
    tractionType: '',
    roofHeight: '',
    bedCapacity: '',
    engineCapacity: '',
    cylinderCount: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files)] }))
    }
  }

  const handleReportUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, report: e.target.files[0] }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the formData to your backend API
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/add-ad`, {
        method: 'POST',
        body: new FormData(e.target),
      })

    const { msg, error } = await response.json();
  
    if (error) {
      return toast({
        title: 'Something went wrong!',
        description: error,
      });
    }

    if (msg) {
      toast({
        title: 'Success!',
        description: msg,
      });

    router.push('/') // Redirect to home page or ad listing page
    }
  })
}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">NoterKapanmadan</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-4 sm:px-6 lg:px-8 space-y-2">
        <h2 className="font-bold text-3xl text-center">Add New Ad</h2>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <RadioGroup
                  name="vehicleType"
                  id="vehicleType"
                  defaultValue="car"
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="car" id="car" />
                    <Label htmlFor="car">Car</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="van" id="van" />
                    <Label htmlFor="van">Van</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="truck" id="truck" />
                    <Label htmlFor="truck">Truck</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="motorcycle" id="motorcycle" />
                    <Label htmlFor="motorcycle">Motorcycle</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Kilometers</Label>
                  <Input
                    id="km"
                    name="km"
                    type="number"
                    value={formData.km}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gear_type">Transmission</Label>
                  <Select onValueChange={handleSelectChange('gear_type')}>
                    <SelectTrigger id="gear_type">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Select onValueChange={handleSelectChange('fuel_type')}>
                    <SelectTrigger id="fuel_type">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.vehicleType === 'car' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seatCount">Seat Count</Label>
                    <Input
                      id="seatCount"
                      name="seatCount"
                      type="number"
                      value={formData.seatCount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Input
                      id="bodyType"
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              {formData.vehicleType === 'truck' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loadCapacity">Load Capacity (kg)</Label>
                    <Input
                      id="loadCapacity"
                      name="loadCapacity"
                      type="number"
                      value={formData.loadCapacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tractionType">Traction Type</Label>
                    <Input
                      id="tractionType"
                      name="tractionType"
                      value={formData.tractionType}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              {formData.vehicleType === 'van' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roofHeight">Roof Height</Label>
                    <Input
                      id="roofHeight"
                      name="roofHeight"
                      value={formData.roofHeight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedCapacity">Bed Capacity</Label>
                    <Input
                      id="bedCapacity"
                      name="bedCapacity"
                      type="number"
                      value={formData.bedCapacity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              {formData.vehicleType === 'motorcycle' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
                    <Input
                      id="engineCapacity"
                      name="engineCapacity"
                      type="number"
                      value={formData.engineCapacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cylinderCount">Cylinder Count</Label>
                    <Input
                      id="cylinderCount"
                      name="cylinderCount"
                      type="number"
                      value={formData.cylinderCount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
                <p className="text-sm text-muted-foreground">You can upload multiple images</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report">Report (PDF)</Label>
                <Input
                  id="report"
                  name="report"
                  type="file"
                  onChange={handleReportUpload}
                  accept=".pdf"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Submit Ad</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

