import {Client} from "@googlemaps/google-maps-services-js";
import { MAPS_KEY } from "./constants";
const client = new Client({});
import Autocomplete from "react-google-autocomplete";

export async function mapsGeocode(text) {
    await client.geocode({
        params:
        {
            key: MAPS_KEY,
            address: text
        }
    })
}

