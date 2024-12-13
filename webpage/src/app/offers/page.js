import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOffers } from "@/app/actions"

const offers = [
  { id: '1', carModel: '2018 Toyota Camry', offeredPrice: 15000, buyerName: 'HTalks', buyerAvatar: '/placeholder.svg?height=40&width=40' },
]

export default async function OffersPage() {
  const offers = await getOffers()
  console.log(offers)

  return (
    <div className="bg-gray-50 min-h-screen">    
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-3 text-center">Offers</h1>
        <Tabs defaultValue="incoming-offers" className="flex flex-col items-center">
          <TabsList className="bg-gray-200">
            <TabsTrigger value="incoming-offers">Incoming Offers</TabsTrigger>
            <TabsTrigger value="sent-offers">Sent Offers</TabsTrigger>
          </TabsList>
          <TabsContent value="incoming-offers" className="w-full">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offers.incomingOffers.length > 0 ? offers.incomingOffers.map((offer) => (
                <Card className="flex flex-col" key={offer.bid_id}>
                  <CardHeader>
                    <CardTitle>{offer.title}</CardTitle>
                    <CardDescription>Offer from {`${offer.bidder_forename} ${offer.bidder_surname}`}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Avatar className="border">
                        <AvatarImage 
                          className="object-cover"
                          src={offer.bidder_profile_photo || "/avatar.png"}  
                        />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{`${offer.bidder_forename} ${offer.bidder_surname}`}</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col justify-center items-start gap-2">
                        <Badge variant="secondary">Ad Price</Badge>
                        <p className="text-lg font-bold">${offer.price}</p>
                      </div>
                      <div className="flex flex-col justify-center items-start gap-2">
                        <Badge variant="secondary">Offered Price</Badge>
                        <p className="text-lg font-bold">${offer.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between *:w-full gap-2">
                    <Button>
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button  variant="outline">
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                <p className="text-gray-600">No incoming offers</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="sent-offers" className="w-full">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offers.sentOffers.length > 0 ? offers.sentOffers.map((offer) => (
                <Card className="flex flex-col" key={offer.bid_id}>
                  <CardHeader>
                    <CardTitle>{offer.title}</CardTitle>
                    <CardDescription>Offer from {`${offer.owner_forename} ${offer.owner_surname}`}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Avatar className="border">
                        <AvatarImage 
                          className="object-cover"
                          src={offer.owner_profile_photo || "/avatar.png"}  
                        />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{`${offer.owner_forename} ${offer.owner_surname}`}</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col justify-center items-start gap-2">
                        <Badge variant="secondary">Ad Price</Badge>
                        <p className="text-lg font-bold">${offer.price}</p>
                      </div>
                      <div className="flex flex-col justify-center items-start gap-2">
                        <Badge variant="secondary">Offered Price</Badge>
                        <p className="text-lg font-bold">${offer.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between *:w-full gap-2">
                    <Button>
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button  variant="outline">
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                <p className="text-gray-600">No sent offers</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}