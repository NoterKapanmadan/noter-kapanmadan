import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">NoterKapanmadan</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Left column: Image gallery and details */}
          <div className="lg:w-2/3 space-y-3">
            <Card>
              <CardContent className="p-0">
                <div className="relative h-[400px]">
                  <Image
                    src={`https://player.sahibinden.com/clip/407/1097480892_pvqljn.jpg`}
                    alt="asdsa"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/80"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mahalle abisinden temiz Tofaş</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-4">
                  300.000 TL
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold">Brand</p>
                    <p>Tofaş</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Model</p>
                    <p>Doğan</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Year</p>
                    <p>1995</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mileage</p>
                    <p>530.000 km</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Transmission</p>
                    <p>Manual</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fuel Type</p>
                    <p>Petrol</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold">Description</p>
                  <p>Tertemiz, pazarlık payı vardır.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right column: Actions and seller info */}
          <div className="lg:w-1/3 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant= "secondary">
                  <MessageCircle className={`mr-2 h-4 w-4`} />
                  Send Message
                </Button>
                <Dialog>
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
                        Enter your offer amount below. The offer will be sent to
                        seller.
                      </DialogDescription>
                    </DialogHeader>
                    <form>
                      <div className="grid gap-3 py-4">
                        <div className="grid grid-cols-4 items-center gap-3">
                          <Label htmlFor="offer" className="text-right">
                            Offer Amount
                          </Label>
                          <Input
                            id="offer"
                            type="number"
                            // value={offerAmount}
                            // onChange={(e) => setOfferAmount(e.target.value)}
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
                <Button
                  variant="outline"
                  className="w-full"
                  // onClick={toggleFavorite}
                >
                  <Heart className={`mr-2 h-4 w-4`} />
                  {"Add to Favorites"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Avatar className="border">
                  <AvatarImage src="/avatar.avif" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="font-semibold">John Doe</p>
                <p>Ankara - Mamak</p>
                <p>Listed on: 12.11.2024</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
