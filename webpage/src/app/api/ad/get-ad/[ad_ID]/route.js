import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { FILE_SERVER_URL } from '@/utils/constants';
import { extractImagesFromAd, extractImagesFromAds } from '@/utils/file';

export async function GET(req, context) {

    const ad_ID = context.params.ad_ID;

    try {
        const ad = await query(
            `SELECT title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type,
            string_agg(image, ',') as images
            FROM Ad 
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            WHERE Ad.ad_ID = $1 
            GROUP BY title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type `,
            [ad_ID]
        );

        const finalizedAd = await extractImagesFromAd(ad.rows[0]);
    
        //console.log("get ad final:", finalizedAd);

        return NextResponse.json(finalizedAd, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}