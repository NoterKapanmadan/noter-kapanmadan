"use client"

import { MAPS_KEY } from "@/utils/constants";
import { useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import { getLocationToAddress } from "@/app/actions";
import { X, MapPinned } from "lucide-react";

// add clear location too +++
// When latitude and longitude are not entered, it may not give a ‘required’ error because location is entered. That needs to be fixed. +++ fixed
// add reset filters feature +++ added
// add use my location +++
// Very interesting indexing can be implement for location, especially for nearby ones, instead of performing a linear scan +++ indexed
// not needed to send location form in formdata +++ fixed


export default function PlaceAutocomplete({ required, isFilter, defaultMaxDistance = 10 }) {

    const [locationText, setLocationText] = useState('');
    const [selectedLatitude, setSelectedLatitude] = useState('');
    const [selectedLongitude, setSelectedLongitude] = useState('');
    const [maxDistance, setMaxDistance] = useState(defaultMaxDistance ? defaultMaxDistance : '');
    const [isLocationPending, setLocationPending] = useState();

    const handlePlaceSelected = (place) => {
        console.log("Place: ", place)
        setSelectedLatitude(place.geometry.location.lat());
        setSelectedLongitude(place.geometry.location.lng());
        setLocationText(place.formatted_address);
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

                    ref.current.value = address;
                    setLocationText(address);
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

    const clearSelection = () => {
        setSelectedLatitude('');
        setSelectedLongitude('');
        ref.current.value = '';
    };

    useEffect(() => {
        if (required) {
            if (selectedLatitude && selectedLongitude) {
                ref.current.setCustomValidity('');
            } else {
                ref.current.setCustomValidity('Please select a location');
            }
        }


    }, [selectedLatitude, selectedLongitude]);

    const isSelected = selectedLatitude && selectedLongitude ? true : false;

    return (

        <>
            <div className="space-y-2">

                <Label htmlFor="location">Location</Label>
                <div className="relative">
                    <Input ref={ref} id="location-select" required={required} className="pr-8" />
                    {isSelected ? (
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                            aria-label="Clear location"
                        >
                            <X className="w-5 h-5 text-gray-500 hover:text-gray-600" />
                        </button>
                    ):
                    <button
                    type="button"
                    onClick={getUserLocation}
                    className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
                    aria-label="Use my location"
                    disabled={isLocationPending}
                >
                    <MapPinned className={`w-5 h-5 text-gray-500 ${!isLocationPending && "hover:text-gray-600"}`} />
                </button>
                    
                    }
                </div>

                {required && <input className="hidden" id="location" name="location" readOnly value={locationText} />}
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