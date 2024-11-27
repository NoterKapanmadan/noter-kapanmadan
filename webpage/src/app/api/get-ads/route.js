import { NextResponse } from 'next/server'
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const ads = await query(
            `SELECT ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type
            FROM Ad JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            WHERE status = 'active' 
            ORDER BY date DESC
            ;`
        );
        return NextResponse.json(ads.rows, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

