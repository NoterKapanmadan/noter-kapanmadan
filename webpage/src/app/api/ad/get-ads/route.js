import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { extractImagesFromAds } from '@/utils/file';

export async function GET(request) {
    try {
        const ads = await query(
            `SELECT Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type,
            string_agg(image, ',') as images
            FROM Ad 
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            WHERE status = 'active' 
            GROUP BY Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type
            ORDER BY date DESC;`
        );

        const finalizedAds = await extractImagesFromAds(ads.rows);
    
        // console.log("get ads final:", finalizedAds);

        return NextResponse.json(finalizedAds, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}