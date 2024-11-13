'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X } from 'lucide-react'

export default function Component() {
  const [offers, setOffers] = useState([
    { id: '1', carModel: '2018 Toyota Camry', offeredPrice: 15000, buyerName: 'HTalks', buyerAvatar: '/placeholder.svg?height=40&width=40' },
    { id: '2', carModel: '2019 Honda Civic', offeredPrice: 16500, buyerName: 'Enis Kirazoğlu', buyerAvatar: '/placeholder.svg?height=40&width=40' },
    { id: '3', carModel: '2020 Ford Mustang', offeredPrice: 28000, buyerName: 'Fırat Sobutay', buyerAvatar: '/placeholder.svg?height=40&width=40' },
  ])

  const handleAccept = (id) => {
    setOffers(offers.filter(offer => offer.id !== id))
    // Here you would typically make an API call to update the offer status
    console.log(`Offer ${id} accepted`)
  }

  const handleReject = (id) => {
    setOffers(offers.filter(offer => offer.id !== id))
    // Here you would typically make an API call to update the offer status
    console.log(`Offer ${id} rejected`)
  }

  return (
    <div className="bg-gray-50 min-h-screen">    
    <header className="bg-primary text-primary-foreground shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">NoterKapanmadan</h1>
      </div>
    </header>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3 text-center">Your Car Offers</h1>
      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No offers available at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle>{offer.carModel}</CardTitle>
                <CardDescription>Offer from {offer.buyerName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="border">
                    <AvatarImage src="/avatar.avif" />
                    <AvatarFallback>{offer.buyerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{offer.buyerName}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">Offered Price</Badge>
                <p className="text-2xl font-bold">${offer.offeredPrice}</p>
              </CardContent>
              <CardFooter className="flex justify-between *:w-full gap-2">
                <Button onClick={() => handleAccept(offer.id)} className="w-[45%]">
                  <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Button onClick={() => handleReject(offer.id)} variant="outline" className="w-[45%]">
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>

  )
}