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
import { useState } from "react";
import { revalidateTagClient } from "@/app/actions";

export default function AdActions({ ad_ID }) {
  const { toast } = useToast();
  const [offerOpen, setOfferOpen] = useState(false);

  const handleSendOffer = async (formData) => {
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
        body: JSON.stringify({ ad_id: ad_ID, amount: offerAmount }),
      });

      if (res.ok) {
        toast({
          title: "Offer Sent",
          description: "Your offer was sent successfully.",
        });
        setOfferOpen(false);
        revalidateTagClient("currentUser");
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
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="offer" className="text-right">
                    Offer Amount
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
                <Button type="submit">Send Offer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="outline" className="w-full">
          <Heart className={`mr-2 h-4 w-4`} />
          Add to Favorites
        </Button>
      </CardContent>
    </Card>
  );
}
