"use client"

import { MAPS_KEY } from "@/utils/constants";
import { useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import { getLocationToAddress } from "@/app/actions";

// add clear location too
// When latitude and longitude are not entered, it may not give a ‘required’ error because location is entered. That needs to be fixed.
// add reset filters feature
// add use my location
// konum için çok ilginç indexing yapılabilir yakın olanlar için filan, linear scan yapmaktansa
// not needed to send location form in formdata


export default function PlaceAutocomplete({ required, isFilter, defaultMaxDistance = 10 }) {

    const [selectedPlace, setSelectedPlace] = useState();
    const [selectedLatitude, setSelectedLatitude] = useState('');
    const [selectedLongitude, setSelectedLongitude] = useState('');
    const [maxDistance, setMaxDistance] = useState(defaultMaxDistance ? defaultMaxDistance : '');
    const [userLocation, setUserLocation] = useState(null);
    const [isLocationPending, setLocationPending] = useState();

    const handlePlaceSelected = (place) => {
        console.log("Place: ", place)
        setSelectedPlace(place);
        setSelectedLatitude(place.geometry.location.lat());
        setSelectedLongitude(place.geometry.location.lng());
        //const lat = place.geometry.location.lat()
        //const long = place.geometry.location.lng()
        //const formatted_address
    }


    const { ref, autocompleteRef } = usePlacesWidget({
        apiKey: MAPS_KEY,
        onPlaceSelected: handlePlaceSelected,
        options: {
            types: ["geocode"]
        }
    });




    // define the function that finds the users geolocation
    const getUserLocation = (e) => {
        e.preventDefault();
        // if geolocation is supported by the users browser
        if (navigator.geolocation) {
            // get the current users location
            setLocationPending(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {

                    // save the geolocation coordinates in two variables
                    const { latitude, longitude } = position.coords;
                    // update the value of userlocation variable

                    const address = await getLocationToAddress(latitude, longitude);
                    console.log("Address:", address)

                    setUserLocation({ latitude, longitude, address: address });
                    ref.current.value = address;
                    setSelectedLatitude(latitude);
                    setSelectedLongitude(longitude);
                    setLocationPending(false);
                
                },
                // if there was an error getting the users location
                (error) => {
                    console.error('Error getting user location:', error);
                    setLocationPending(false);
                }
            );
        }
        // if geolocation is not supported by the users browser
        else {
            console.error('Geolocation is not supported by this browser.');
        }
    };



    return (

        <>
            <div className="space-y-2">

                <Label htmlFor="location">Location</Label>
                <Input ref={ref} id="location" name="location" required={required} />
                <Button onClick={getUserLocation} disabled={isLocationPending}>Get User Location</Button>

                <input className="hidden" id="latitude" name="latitude" readOnly value={selectedLatitude} />
                <input className="hidden" id="longitude" name="longitude" readOnly value={selectedLongitude} />
            </div>
            {selectedLatitude && isFilter ? <div className="space-y-2">
                <Label>Max Distance</Label>
                <Slider
                    min={1}
                    max={2000}
                    step={1}
                    defaultValue={[defaultMaxDistance]}
                    onValueChange={(value) => setMaxDistance(value >= 2000 ? 9999999999 : value)} />
                <div className="text-right text-sm text-muted-foreground">{maxDistance >= 2000 ? `No max distance` : `${maxDistance} km`}</div>
                <input className="hidden" id="maxDistance" name="maxDistance" readOnly value={maxDistance} />
            </div>
                : <></>}

        </>
    )
}