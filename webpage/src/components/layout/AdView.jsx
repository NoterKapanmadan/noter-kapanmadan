"use client";

import { useState, startTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdImageCarousel from "@/components/layout/AdImageCarousel";
import AdActions from "@/components/layout/AdActions";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { capitalizeFirstLetters } from "@/utils/helpers";
import { formatDate } from "@/utils/date";
import { revalidateTagClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";

export default function AdViewClient({ ad, isAuth, currentUserID}) {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast()

  const [title, setTitle] = useState(ad.title || "");
  const [price, setPrice] = useState(ad.price || "");
  const [brand, setBrand] = useState(ad.brand || "");
  const [model, setModel] = useState(ad.model || "");
  const [year, setYear] = useState(ad.year || "");
  const [km, setKm] = useState(ad.km || "");
  const [gearType, setGearType] = useState(ad.gear_type || "");
  const [fuelType, setFuelType] = useState(ad.fuel_type || "");
  const [description, setDescription] = useState(ad.description || "");

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdateClick = async () => {
    startTransition(async () => {
      const updatedData = {
        title,
        price,
        brand,
        model,
        year,
        km,
        gear_type: gearType,
        fuel_type: fuelType,
        description,
      };

      const res = await fetch(`${SERVER_URL}/ad/update-ad/${ad.ad_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
          cache: 'no-cache',
        });
      
      
        if (!res.ok) {
          throw new Error("Failed to update ad");
        }
      
        const { msg, error } = await res.json();

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

        revalidateTagClient(`/ad/${ad.ad_id}`)
        setEditMode(false);
      }
    })
  };

  console.log("ad user id, user id", ad.user_id, currentUserID)

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left Content */}
      <div className="lg:w-2/3 flex flex-col gap-4">
        {/* Images Carousel */}
        <Card>
          <CardContent className="p-0">
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
            <div className="flex justify-between items-center">
              {editMode ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ad Title"
                />
              ) : (
                <CardTitle className="inline-block">{ad.title || "Ad Title"}</CardTitle>
              )}
              <div className="flex gap-1">
                {!editMode && (ad.user_id == currentUserID) && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-blue-500 h-8 w-8"
                    onClick={handleEditClick}
                  >
                    <Pencil size={18} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 h-8 w-8"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price ($)"
                  className="mb-4"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold">Brand</p>
                    <Input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Brand"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Model</p>
                    <Input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Model"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Year</p>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mileage</p>
                    <Input
                      type="number"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                      placeholder="Mileage (km)"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Transmission</p>
                    <Input
                      value={gearType}
                      onChange={(e) => setGearType(e.target.value)}
                      placeholder="Transmission"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fuel Type</p>
                    <Input
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      placeholder="Fuel Type"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Listed On</p>
                    <p>
                      {ad.date ? formatDate(ad.date) : "Date Not Available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Location</p>
                    <p>{ad.location || "Location Not Specified"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold">Description</p>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleUpdateClick}>Update</Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-primary mb-4">
                  {ad.price ? `$${ad.price}` : "Price Not Available"}
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

                  <div>
                    <p className="text-sm font-semibold">Listed On</p>
                    <p>
                      {ad.date
                        ? formatDate(ad.date)
                        : "Date Not Available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Location</p>
                    <p>{ad.location || "Location Not Specified"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold">Description</p>
                  <p>{ad.description || "No Description Available"}</p>
                </div>
              </>
            )}
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
              <p>{ad.phone_number || "Phone Number Not Specified"}</p>
              <p>{ad.email || "Email Not Specified"}</p>
            </Link>
          </CardContent>
        </Card>

        {/* Actions */}
        {isAuth && (
          <AdActions ad={ad} />
        )}
      </div>
    </div>
  );
}