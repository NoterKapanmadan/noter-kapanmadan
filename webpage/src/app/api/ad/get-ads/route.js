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
    // const location = url.searchParams.get('location');
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const minYear = url.searchParams.get('minYear');
    const maxYear = url.searchParams.get('maxYear');
    const maxKm = url.searchParams.get('maxKm');
    const gear_type = url.searchParams.get('gear_type');
    const fuel_type = url.searchParams.get('fuel_type');
    const latitude = url.searchParams.get('latitude');
    const longitude = url.searchParams.get('longitude');
    const maxDistance = url.searchParams.get('maxDistance');

    const page = parseInt(url.searchParams.get('page') || '1', 10);

    const limit = 9;
    const offset = (page - 1) * limit;

    const conditions = ["status = 'active'"];
    const params = [];
    let paramIndex = 1;

    if (title) {
        conditions.push(`title ILIKE $${paramIndex}`);
        params.push(`%${title}%`);
        paramIndex++;
    }

    /* old location filter
    if (location) {
        conditions.push(`location ILIKE $${paramIndex}`);
        params.push(`%${location}%`);
        paramIndex++;
    }
*/

    if (brand) {
        conditions.push(`brand ILIKE $${paramIndex}`);
        params.push(`%${brand}%`);
        paramIndex++;
    }

    if (model) {
        conditions.push(`model ILIKE $${paramIndex}`);
        params.push(`%${model}%`);
        paramIndex++;
    }

    if (minPrice) {
        conditions.push(`price >= $${paramIndex}`);
        params.push(minPrice);
        paramIndex++;
    }

    if (maxPrice) {
        conditions.push(`price <= $${paramIndex}`);
        params.push(maxPrice);
        paramIndex++;
    }

    if (minYear) {
        conditions.push(`year >= $${paramIndex}`);
        params.push(minYear);
        paramIndex++;
    }

    if (maxYear) {
        conditions.push(`year <= $${paramIndex}`);
        params.push(maxYear);
        paramIndex++;
    }

    if (maxKm) {
        conditions.push(`km <= $${paramIndex}`);
        params.push(maxKm);
        paramIndex++;
    }

    if (gear_type) {
        conditions.push(`gear_type = $${paramIndex}`);
        params.push(gear_type);
        paramIndex++;
    }

    if (fuel_type) {
        conditions.push(`fuel_type = $${paramIndex}`);
        params.push(fuel_type);
        paramIndex++;
    }


    if (latitude && longitude && maxDistance && maxDistance < 2000) {
        // for better efficiency, first use latitude and longitude differences to use index, after that calculate complex distance formula
        conditions.push(`
  latitude BETWEEN $1 - ($3 / 111.32)
              AND $1 + ($3 / 111.32)
  AND
  longitude BETWEEN $2 - ($3 / (111.32 * COS(RADIANS($1))))
               AND $2 + ($3 / (111.32 * COS(RADIANS($1))))
  AND (
    6371 * ACOS(
      COS(RADIANS($1)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS($2))
      + SIN(RADIANS($1)) * SIN(RADIANS(latitude))
    )
  ) < $3`);
        params.push(latitude);
        params.push(longitude);
        params.push(maxDistance);
        paramIndex += 3;
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const adsParams = [...params, limit, offset];

    try {
        const countRes = await query(`
            SELECT COUNT(*) as total_count
            FROM Ad
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            ${whereClause};`,
            params
        );

        const totalCount = parseInt(countRes.rows[0].total_count, 10);
        const totalPages = Math.ceil(totalCount / limit);

        const ads = await query(`
            SELECT Ad.ad_ID, title, description, price, location, latitude, longitude, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type,
                   string_agg(image, ',') as images
            FROM Ad
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            ${whereClause}
            GROUP BY Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type
            ORDER BY date DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`,
            adsParams
        );

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