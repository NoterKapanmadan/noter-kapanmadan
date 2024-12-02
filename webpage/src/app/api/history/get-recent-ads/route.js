import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { extractImagesFromAds } from '@/utils/file';


export async function GET(request) {
    try{
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)
        console.log(account_id);
        const ads = await query(
            `SELECT Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type, visit_date,
            string_agg(image, ',') as images
            FROM Visits JOIN Ad ON Ad.ad_ID = Visits.ad_ID JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            WHERE status = 'active' AND Visits.account_ID = $1
            GROUP BY Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type, visit_date
            ORDER BY visit_date DESC
            LIMIT 10;`
            , [account_id]
        );
        console.log(ads);
        const finalizedAds = await extractImagesFromAds(ads.rows);
        return NextResponse.json(finalizedAds, { status: 200 })
    } 
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}