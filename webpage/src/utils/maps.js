import {Client} from "@googlemaps/google-maps-services-js";
import { MAPS_KEY } from "./constants";
const client = new Client({});

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    // Convert degrees to radians
    const toRadians = (degree) => (degree * Math.PI) / 180;

    // Earth's radius in kilometers
    const R = 6371;

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    return R * c;
};

export async function mapsGeocode(text) {
    await client.geocode({
        params:
        {
            key: MAPS_KEY,
            address: text
        }
    })
}

