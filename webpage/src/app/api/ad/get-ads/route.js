import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { FILE_SERVER_URL } from '@/utils/constants';
import { extractImagesFromAds } from '@/utils/file';

export async function GET(request) {
    const url = new URL(request.url);
  
    const title = url.searchParams.get('title');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const date = url.searchParams.get('date'); // If needed
    const location = url.searchParams.get('location');
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const minYear = url.searchParams.get('minYear');
    const maxYear = url.searchParams.get('maxYear');
    const maxKm = url.searchParams.get('maxKm');
    const gear_type = url.searchParams.get('gear_type');
    const fuel_type = url.searchParams.get('fuel_type');
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const limit = 9;
    const offset = (page - 1) * limit;

    let conditions = ["status = 'active'"];

    console.log("maxPrice", maxPrice)

    if (title) conditions.push(`title ILIKE '%${title}%'`);
    if (location) conditions.push(`location ILIKE '%${location}%'`);
    if (brand) conditions.push(`brand ILIKE '%${brand}%'`);
    if (model) conditions.push(`model ILIKE '%${model}%'`);
    if (minPrice) conditions.push(`price >= ${minPrice}`);
    if (maxPrice) conditions.push(`price <= ${maxPrice}`);
    if (minYear) conditions.push(`year >= ${minYear}`);
    if (maxYear) conditions.push(`year <= ${maxYear}`);
    if (maxKm) conditions.push(`km <= ${maxKm}`);
    if (gear_type) conditions.push(`gear_type = '${gear_type}'`);
    if (fuel_type) conditions.push(`fuel_type = '${fuel_type}'`);


    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    console.log(whereClause);

    try {
        const countRes = await query(`
            SELECT COUNT(*) as total_count
            FROM Ad
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            ${whereClause};
        `);

        const totalCount = parseInt(countRes.rows[0].total_count, 10);
        const totalPages = Math.ceil(totalCount / limit);

        const ads = await query(`
            SELECT Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type,
                   string_agg(image, ',') as images
            FROM Ad
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            ${whereClause}
            GROUP BY Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type
            ORDER BY date DESC
            LIMIT ${limit} OFFSET ${offset};
        `);

        const finalizedAds = await extractImagesFromAds(ads.rows);

        return NextResponse.json(
            {
                totalPages,
                vehicleAds: finalizedAds
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}