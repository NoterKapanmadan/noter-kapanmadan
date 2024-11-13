"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function Component() {
  const [sentOffers, setSentOffers] = useState([
    {
      id: "1",
      carModel: "2019 Ford F-150",
      offeredPrice: 25000,
      sellerName: "Alice Johnson",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      status: "pending",
    },
    {
      id: "2",
      carModel: "2020 Tesla Model 3",
      offeredPrice: 35000,
      sellerName: "Bob Williams",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      status: "accepted",
    },
    {
      id: "3",
      carModel: "2018 BMW X5",
      offeredPrice: 30000,
      sellerName: "Carol Davis",
      sellerAvatar: "/placeholder.svg?height=40&width=40",
      status: "rejected",
    },
  ]);

  const handleCancelOffer = (id) => {
    setSentOffers(sentOffers.filter((offer) => offer.id !== id));
    // Here you would typically make an API call to cancel the offer
    console.log(`Offer ${id} cancelled`);
  };

  const handleBuy = (id) => {
    // Here you would typically make an API call to initiate the purchase
    console.log(`Initiating purchase for offer ${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 text-white">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Sent Offers</h1>
      {sentOffers.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't sent any offers yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sentOffers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle>{offer.carModel}</CardTitle>
                <CardDescription>Offer to {offer.sellerName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={offer.sellerAvatar}
                      alt={offer.sellerName}
                    />
                    <AvatarFallback>
                      {offer.sellerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{offer.sellerName}</p>
                    <p className="text-sm text-muted-foreground">Car Seller</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="mb-2">
                    Your Offer
                  </Badge>
                  {getStatusBadge(offer.status)}
                </div>
                <p className="text-2xl font-bold">${offer.offeredPrice}</p>
              </CardContent>
              <CardFooter>
                {offer.status === "pending" && (
                  <Button
                    onClick={() => handleCancelOffer(offer.id)}
                    variant="outline"
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel Offer
                  </Button>
                )}
                {offer.status === "accepted" && (
                  <Button
                    onClick={() => handleBuy(offer.id)}
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                )}
                {offer.status === "rejected" && (
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Offer rejected. Browse more cars.
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
