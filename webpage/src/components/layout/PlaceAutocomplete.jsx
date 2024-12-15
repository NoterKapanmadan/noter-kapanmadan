"use client"

import { MAPS_KEY } from "@/utils/constants";
import { useState } from "react";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// add clear location too
export default function PlaceAutocomplete({ required, isFilter = true, defaultMaxDistance = 10 }) {

    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedLatitude, setSelectedLatitude] = useState('');
    const [selectedLongtitude, setSelectedLongtitude] = useState('');
    const [maxDistance, setMaxDistance] = useState(defaultMaxDistance ? defaultMaxDistance : '');

    const handlePlaceSelected = (place) => {
        console.log("Place: ", place)
        setSelectedPlace(place);
        setSelectedLatitude(place.geometry.location.lat());
        setSelectedLongtitude(place.geometry.location.lng());
        //const lat = place.geometry.location.lat()
        //const long = place.geometry.location.lng()
        //const formatted_address
    }

    const { ref, autocompleteRef } = usePlacesWidget({
        apiKey: MAPS_KEY,
        onPlaceSelected: handlePlaceSelected,
        options:{
            types: ["geocode"]
        }
    });



    return (

        <>
            <div className="space-y-2">

                <Label htmlFor="location">Location</Label>
                <Input ref={ref} id="location" name="location" required={required} />
                <input className="hidden" id="latitude" name="latitude" readOnly value={selectedLatitude} />
                <input className="hidden" id="latitude" name="longtitude" readOnly value={selectedLongtitude} />
            </div>
            {selectedLatitude && isFilter ? <div className="space-y-2">
                <Label>Max Distance</Label>
                <Slider
                    min={1}
                    max={2000}
                    step={1}
                    defaultValue={[defaultMaxDistance]}
                    onValueChange={(value) => setMaxDistance(value >= 2000 ? 9999999999: value)} />
                <div className="text-right text-sm text-muted-foreground">{maxDistance >= 2000 ? `No max distance` : `${maxDistance} km` }</div>
                <input className="hidden" id="maxDistance" name="maxDistance" readOnly value={maxDistance} />
            </div>
                : <></>}

</>
    )
}