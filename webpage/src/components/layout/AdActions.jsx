'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  HandCoins,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SERVER_URL } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { revalidateTagClient, revalidatePathClient } from "@/app/actions";

export default function AdActions({ ad }) {
  const { toast } = useToast();
  const [offerOpen, setOfferOpen] = useState(false);
  const [pendingOffer, startOfferTransition] = useTransition()
  const [pendingFavorite, startFavoriteTransition] = useTransition()

  const handleFavorite = async () => {
    startFavoriteTransition(async () => {
      try {
        const res = await fetch(`${SERVER_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ad_ID: ad.ad_id }),
        });

        if (res.ok) {
          revalidatePathClient(`/ad/${ad.ad_id}`);
        } else {
          const error = await res.json();
          toast({
            title: "Error",
            description: error.message,
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    })
  };

  const handleSendOffer = async (formData) => {
    startOfferTransition(async () => {
      const offerAmount = formData.get("offer");

      if (!offerAmount || offerAmount <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid offer amount.",
        });
        return;
      }

      try {
        const res = await fetch(`${SERVER_URL}/offer/send-offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ad_id: ad.ad_id, amount: offerAmount }),
        });

        if (res.ok) {
          toast({
            title: "Offer Sent",
            description: "Your offer was sent successfully.",
          });

          revalidateTagClient("offers");
          setOfferOpen(false);
        } else {
          const error = await res.json();
          toast({
            title: "Error",
            description: `Failed to send offer: ${error.message}`,
          });
        }
      } catch (error) {
        console.error("Error sending offer:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" variant="secondary">
          <MessageCircle className={`mr-2 h-4 w-4`} />
          Send Message
        </Button>
        <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <HandCoins className={`mr-2 h-4 w-4`} />
              Make an Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Make an Offer</DialogTitle>
              <DialogDescription>
                Enter your offer amount below. The offer will be sent to the seller.
              </DialogDescription>
            </DialogHeader>
            <form action={handleSendOffer}>
              <div className="grid gap-3 py-4">
                <div className="flex flex-col items-start gap-3">
                  <Label htmlFor="offer" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="offer"
                    name="offer"
                    type="number"
                    className="col-span-3"
                    placeholder="Enter your offer"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pendingOffer}>Send Offer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button 
          onClick={handleFavorite}
          variant="outline"
          className="w-full" 
          disabled={pendingFavorite}
        >
          <Heart fill={ad.is_favorited ? "black" : "transparent"} className={`mr-2 h-4 w-4 `} />
          {ad.is_favorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </CardContent>
    </Card>
  );
}
