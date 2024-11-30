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
  const [vehicleType, setVehicleType] = useState('car')

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/ad/add-ad`, {
        method: 'POST',
        body: formData,
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
          <form action={handleSubmit}>
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
                  onValueChange={(value) => setVehicleType(value)}
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Kilometers</Label>
                  <Input
                    id="km"
                    name="km"
                    type="number"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gear_type">Transmission</Label>
                  <Select name="transmission" >
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
                  <Select name="fuelType">
                    <SelectTrigger id="fuel_type">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {vehicleType === 'car' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seatCount">Seat Count</Label>
                    <Input
                      id="seatCount"
                      name="seatCount"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Input
                      id="bodyType"
                      name="bodyType"
                    />
                  </div>
                </div>
              )}
              {vehicleType === 'truck' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loadCapacity">Load Capacity (kg)</Label>
                    <Input
                      id="loadCapacity"
                      name="loadCapacity"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tractionType">Traction Type</Label>
                    <Select name="tractionType">
                    <SelectTrigger id="tractionType">
                      <SelectValue placeholder="Select traction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2WD">2WD</SelectItem>
                      <SelectItem value="4WD">4WD</SelectItem>
                      <SelectItem value="6WD">6WD</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>
              )}
              {vehicleType === 'van' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roofHeight">Roof Height</Label>
                    <Input
                      id="roofHeight"
                      name="roofHeight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedCapacity">Bed Capacity</Label>
                    <Input
                      id="bedCapacity"
                      name="bedCapacity"
                      type="number"
                    />
                  </div>
                </div>
              )}
              {vehicleType === 'motorcycle' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
                    <Input
                      id="engineCapacity"
                      name="engineCapacity"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cylinderCount">Cylinder Count</Label>
                    <Input
                      id="cylinderCount"
                      name="cylinderCount"
                      type="number"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
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

