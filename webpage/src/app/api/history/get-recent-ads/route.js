import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { extractImagesFromAds } from '@/utils/file';


export async function GET(request) {
    try{
        const { account_id , isAdmin} = await decrypt(request.cookies.get("Authorization").value)
        if(isAdmin){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        console.log(account_id);
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
        const sortBy = url.searchParams.get('sortBy');
        const order = url.searchParams.get('order');
    
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
        conditions.push(`Visits.account_id = $${paramIndex}`);
        params.push(account_id);
        paramIndex++;
    
        if (latitude && longitude && maxDistance && maxDistance < 2000) {
            // for better efficiency, first use latitude and longitude differences to use index, after that calculate complex distance formula
            conditions.push(`
      latitude BETWEEN $${paramIndex} - ($${paramIndex + 2} / 111.32)
                  AND $${paramIndex} + ($${paramIndex + 2} / 111.32)
      AND
      longitude BETWEEN $${paramIndex + 1} - ($${paramIndex + 2} / (111.32 * COS(RADIANS($${paramIndex}))))
                   AND $${paramIndex + 1} + ($${paramIndex + 2} / (111.32 * COS(RADIANS($${paramIndex}))))
      AND (
        6371 * ACOS(
          COS(RADIANS($${paramIndex})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS($${paramIndex + 1}))
          + SIN(RADIANS($${paramIndex})) * SIN(RADIANS(latitude))
        )
      ) < $${paramIndex + 2}`);
            params.push(latitude);
            params.push(longitude);
            params.push(maxDistance);
            paramIndex += 3;
        }
        
        // WHERE
        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
        const adsParams = [...params, limit, offset];

        // ORDER BY
        const allowedSortColumns = ['visit_date', 'price', 'year', 'km'];
        
        let safeSortBy = 'visit_date'
        if (allowedSortColumns.includes(sortBy)) {
            safeSortBy = sortBy;
        }

        let safeOrder = 'DESC';
        if (order && order.toLowerCase() === 'asc') {
            safeOrder = 'ASC';
        }

        const sortClause = `ORDER BY ${safeSortBy} ${safeOrder}`;

        const countRes = await query(`
            SELECT COUNT(*) as total_count
            FROM Ad
            JOIN Visits on Ad.ad_ID = Visits.ad_ID JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            ${whereClause};`,
            params
        );

        const totalCount = parseInt(countRes.rows[0].total_count, 10);
        const totalPages = Math.ceil(totalCount / limit);

        const ads = await query(`
            SELECT Ad.ad_ID, title, description, price, location, latitude, longitude, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type,
                   string_agg(image, ',') as images, visit_date
            FROM Ad
            JOIN Visits on Ad.ad_ID = Visits.ad_ID JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            ${whereClause}
            GROUP BY Ad.ad_ID, title, description, price, location, date, status, brand, model, year, Ad.vehicle_ID, km, gear_type, fuel_type, visit_date
            ${sortClause}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`,
            adsParams
        );
        let finalizedAds = ads.rows;
        try {
        finalizedAds = await extractImagesFromAds(ads.rows);
        } catch (err) {
            console.error("Error on image server fetch: ", err);
        }

        return NextResponse.json(
            {
                totalPages,
                vehicleAds: finalizedAds
            },
            { status: 200 }
        );
    } 
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}