"use client";

import { useState, useTransition } from "react";
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
import { getModels, revalidateTagClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast"
import { SERVER_URL } from "@/utils/constants";
import PlaceAutocomplete from './PlaceAutocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import Ratings from "@/components/layout/Ratings";

export default function AdViewClient({ ratings, ad, isAuth, currentUserID, brands, defaultBrandModels, metricsData}) {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast()

  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const [models, setModels] = useState(defaultBrandModels)
  const [modelKey, setModelKey] = useState(0) // to reset the select component
  const [modelChanged, setModelChanged] = useState(false)


  const handleBrandChange = async (value) => {
    setModelChanged(true);
    setModelKey((value) => value + 1) // to reset the select component
    setModels([])
    const newModels = await getModels(value);
    setModels(newModels)
  }

  const handleModelChange = (value) => {
    setModelChanged(true);
  }

  const handleEditClick = () => {
    setModelChanged(false);
    setModels(defaultBrandModels)
    setModelKey((value) => value + 1) // to reset the select component
    setEditMode(true);
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`${SERVER_URL}/ad/delete-ad/${ad.ad_id}`, {
          method: "POST",
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
        router.push("/");
      }
    })
  };

  const handleSubmit = (formData) => {
    startTransition(async () => {

      const res = await fetch(`${SERVER_URL}/ad/update-ad/${ad.ad_id}`, {
          method: "POST",
          body: formData,
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
              adID={ad.ad_id}
              adUserID={ad.user_id}
              currentUserID={currentUserID}
              images={ad.images || []}
              base64Images={ad.base64Images || []}
              dimensions={ad.dimensions || []}
              metricsData={metricsData}
            />
          </CardContent>
        </Card>

        {/* Ad Details */}
        <Card>
        <form action={handleSubmit}>
            <CardHeader>
              <div className="flex justify-between items-center">
                {editMode ? (
                  <Input
                    name="title"
                    defaultValue={ad.title}
                    placeholder="Ad Title"
                    className="w-full"
                  />
                ) : (
                  <CardTitle className="inline-block">
                    {ad.title || "Ad Title"}
                  </CardTitle>
                )}
                  {!editMode && ad.user_id === currentUserID && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-blue-500 h-8 w-8"
                        onClick={handleEditClick}
                      >
                        <Pencil size={18} />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 h-8 w-8"
                        onClick={handleDelete}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <>
                  <div className="space-y-2">  
                    <p className="text-sm font-semibold">Price</p>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      defaultValue={ad.price}
                      placeholder="Price ($)"
                      className="mb-4"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Brand</p>
                      <Select
                        name="brand"
                        id="brand"
                        onValueChange={(value) => handleBrandChange(value)}
                        required
                        defaultValue={ad.brand}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => 
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Model</p>
                      <Select
                        name="model"
                        id="model"
                        disabled={models.length === 0 || models == null}
                        key={modelKey}
                        defaultValue={modelChanged ? undefined : ad.model}
                        onValueChange={(value) => handleModelChange(value)}
                        required
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models && models.map((model) => 
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Year</p>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        defaultValue={ad.year}
                        placeholder="Year"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Mileage</p>
                      <Input
                        id="km"
                        name="km"
                        type="number"
                        defaultValue={ad.km}
                        placeholder="Mileage (km)"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Transmission</p>
                      <Select
                        id="gearType"
                        name="gearType"
                        defaultValue={ad.gear_type}>
                        <SelectTrigger>
                          <SelectValue placeholder="Gear Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Fuel Type</p>
                      <Select
                        id="fuelType"
                        name="fuelType"
                        defaultValue={ad.fuel_type}>
                        <SelectTrigger>
                          <SelectValue placeholder="Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Listed On</p>
                      <p>{ad.date ? formatDate(ad.date) : "Date Not Available"}</p>
                    </div>
                    <div>
                      <PlaceAutocomplete required defaultLocation={ad.location} oldLatitude={ad.latitude} oldLongitude={ad.longitude}/>
                    </div>
                    {ad.vehicleDetails && ad.vehicleDetails.type === "Car" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Seat Count</p>
                          <Input
                            id="seatCount"
                            name="seatCount"
                            type="number"
                            defaultValue={ad.vehicleDetails.seatCount}
                            placeholder="Number of seats"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Body Type</p>
                          <Input
                            id="bodyType"
                            name="bodyType"
                            type="text"
                            defaultValue={ad.vehicleDetails.bodyType}
                            placeholder="Car body type (e.g. sedan, hatchback...)"
                          />
                        </div>
                      </>
                    )}
                    {ad.vehicleDetails && ad.vehicleDetails.type === "Truck" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">
                            Load Capacity (kg)
                          </p>
                          <Input
                            id="loadCapacity"
                            name="loadCapacity"
                            type="number"
                            defaultValue={ad.vehicleDetails.loadCapacity}
                            placeholder="Load capacity in kg"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Traction Type</p>
                          <Select
                            name="tractionType"
                            id="tractionType"
                            defaultValue={ad.vehicleDetails.tractionType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Traction Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2WD">2WD</SelectItem>
                              <SelectItem value="4WD">4WD</SelectItem>
                              <SelectItem value="6WD">6WD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    {ad.vehicleDetails && ad.vehicleDetails.type === "Van" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Roof Height (m)</p>
                          <Input
                            id="roofHeight"
                            name="roofHeight"
                            type="number"
                            step="0.01"
                            defaultValue={ad.vehicleDetails.roofHeight}
                            placeholder="Roof height in meters"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Bed Capacity</p>
                          <Input
                            id="bedCapacity"
                            name="bedCapacity"
                            type="text"
                            defaultValue={ad.vehicleDetails.bedCapacity}
                            placeholder="Bed capacity"
                          />
                        </div>
                      </>
                    )}
                    {ad.vehicleDetails && ad.vehicleDetails.type === "Motorcycle" && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">
                            Engine Capacity (cc)
                          </p>
                          <Input
                            id="engineCapacity"
                            name="engineCapacity"
                            type="number"
                            defaultValue={ad.vehicleDetails.engineCapacity}
                            placeholder="Engine capacity in cc"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Cylinder Count</p>
                          <Input
                            id="cylinderCount"
                            name="cylinderCount"
                            type="number"
                            defaultValue={ad.vehicleDetails.cylinderCount}
                            placeholder="Number of cylinders"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Description</p>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={ad.description}
                      placeholder="Description"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button type="submit" disabled={pending}>Update</Button>
                    <Button variant="outline" disabled={pending} onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
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
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold">Description</p>
                    <p>{ad.description || "No Description Available"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </form>
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
            <Ratings fullname={`${ad.name} ${ad.surname}`} ratings={ratings} />
          </CardContent>
        </Card>

        {/* Actions */}
        {isAuth && (
          <AdActions ad={ad} owner_ID={ad.account_id} />
        )}
      </div>
    </div>
  );
}