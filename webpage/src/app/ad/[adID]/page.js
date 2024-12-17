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
import AdImageCarousel  from "@/components/layout/AdImageCarousel";
import AdActions from "@/components/layout/AdActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendHistory, isAuthenticated } from "@/app/actions";
import { SERVER_URL } from "@/utils/constants";
import Link from "next/link";
import { capitalizeFirstLetters } from "@/utils/helpers";
import { formatDate } from "@/utils/date";

export default async function AdPage({ params }) {
  const isAuth = await isAuthenticated();
  sendHistory(params.adID);

  const ad_ID = params.adID;
  const res = await fetch(`${SERVER_URL}/ad/get-ad/${ad_ID}`, {
    method: "GET",
    cache: "no-cache",
  });
  const ad = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Content */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {/* Images Carousel */}
            <Card>
              <CardContent className="p-0">
                {/* Link to Client Component */}
                <AdImageCarousel
                  images={ad.images || []}
                  base64Images={ad.base64Images || []}
                  dimensions={ad.dimensions || []}
                />
              </CardContent>
            </Card>
            {/* Ad Details */}
            <Card>
              <CardHeader>
                <CardTitle>{ad.title || "Ad Title"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-4">
                  {ad.price ? `${ad.price} TL` : "Price Not Available"}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold">Brand</p>
                    <p>{capitalizeFirstLetters(ad.brand) || "Not Specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Model</p>
                    <p>{capitalizeFirstLetters(ad.model) || "Not Specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Year</p>
                    <p>{ad.year || "Not Specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mileage</p>
                    <p>{ad.km ? `${ad.km} km` : "Not Specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Transmission</p>
                    <p>{capitalizeFirstLetters(ad.gear_type) || "Not Specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fuel Type</p>
                    <p>{capitalizeFirstLetters(ad.fuel_type) || "Not Specified"}</p>
                  </div>

                  {/* Vehicle-Specific Details */}
                  {ad.vehicleDetails && ad.vehicleDetails.type === "Car" && (
                    <>
                      <div>
                        <p className="text-sm font-semibold">Seat Count</p>
                        <p>{ad.vehicleDetails.seatCount || "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Body Type</p>
                        <p>{capitalizeFirstLetters(ad.vehicleDetails.bodyType) || "Not Specified"}</p>
                      </div>
                    </>
                  )}

                  {ad.vehicleDetails && ad.vehicleDetails.type === "Truck" && (
                    <>
                      <div>
                        <p className="text-sm font-semibold">Load Capacity</p>
                        <p>{ad.vehicleDetails.loadCapacity ? `${ad.vehicleDetails.loadCapacity} kg` : "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Traction Type</p>
                        <p>{capitalizeFirstLetters(ad.vehicleDetails.tractionType) || "Not Specified"}</p>
                      </div>
                    </>
                  )}

                  {ad.vehicleDetails && ad.vehicleDetails.type === "Van" && (
                    <>
                      <div>
                        <p className="text-sm font-semibold">Roof Height</p>
                        <p>{ad.vehicleDetails.roofHeight ? `${ad.vehicleDetails.roofHeight} m` : "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Bed Capacity</p>
                        <p>{ad.vehicleDetails.bedCapacity || "Not Specified"}</p>
                      </div>
                    </>
                  )}

                  {ad.vehicleDetails && ad.vehicleDetails.type === "Motorcycle" && (
                    <>
                      <div>
                        <p className="text-sm font-semibold">Engine Capacity</p>
                        <p>{ad.vehicleDetails.engineCapacity ? `${ad.vehicleDetails.engineCapacity} cc` : "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Cylinder Count</p>
                        <p>{ad.vehicleDetails.cylinderCount || "Not Specified"}</p>
                      </div>
                    </>
                  )}
                  <div className="">
                  <p className="text-sm font-semibold">Listed On</p>
                  <p>
                    {ad.date
                      ? formatDate(ad.date)
                      : "Date Not Available"}
                  </p>
                </div>
                <div className="">
                  <p className="text-sm font-semibold">Location</p>
                  <p>{ad.location || "Location Not Specified"}</p>
                </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-semibold">Description</p>
                  <p>{ad.description || "No Description Available"}</p>
                </div>
              </CardContent>
            </Card>


          </div>
          {/* Right Content */}
          <div className="lg:w-1/3 space-y-4">
            {/* Seller Information */}
            <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/profile/${ad.account_id}`}>
              <Avatar className="border w-16 h-16">
                <AvatarImage
                  className="object-cover"
                  src={ad.profilePhotoData || "/avatar.png"} 
                  alt={`${ad.name} ${ad.surname}`}
                />
              </Avatar>
              <p className="font-semibold">{ad.name + " " + ad.surname}</p>
              <p>
                {" "}
                {ad.phone_number || "Phone Number Not Specified"}
              </p>
              <p>{ad.email || "Email Not Specified"}</p>
              
              </Link>
            </CardContent>
          </Card>

            {/* Actions */}
            {isAuth && (
              <AdActions ad_ID= {ad_ID}/>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
