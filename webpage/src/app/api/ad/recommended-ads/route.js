import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractImagesFromAds } from '@/utils/file';
import { decrypt } from '@/lib/auth';

export async function GET(req) {
    const { account_id } = await decrypt(req.cookies.get("Authorization").value)

    try{
        const res = await query(
        `WITH user_interactions AS (
            SELECT
            ad_ID,
            COUNT(*) AS interaction_count
            FROM (
            (SELECT ad_ID FROM Favorites WHERE account_ID = $1)
            UNION ALL
            (SELECT ad_ID FROM Visits WHERE account_ID = $1 ORDER BY visit_date DESC LIMIT 20)
            UNION ALL
            (SELECT ad_ID FROM Bid WHERE user_ID = $1 ORDER BY date DESC LIMIT 20)
            ) user_data
            GROUP BY ad_ID
        ),
        ad_attributes AS (
            SELECT
            a.ad_ID,
            v.gear_type,
            v.fuel_type,
            a.price,
            a.location,
            a.latitude,
            a.longitude,
            v.brand,
            v.model,
            v.year,
            v.km,
            (CASE 
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Car) THEN 'Car'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Motorcycle) THEN 'Motorcycle'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Truck) THEN 'Truck'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Van)   THEN 'Van'
                ELSE 'Other' 
            END) AS vehicle_type
            FROM Ad a
            INNER JOIN Vehicle v ON a.vehicle_ID = v.vehicle_ID
            WHERE a.ad_ID IN (SELECT ad_ID FROM user_interactions)
        ),
        similar_ads AS (
            SELECT
            a.ad_ID,
            v.gear_type,
            v.fuel_type,
            a.price,
            a.location,
            a.latitude,
            (CASE 
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Car) THEN 'Car'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Motorcycle) THEN 'Motorcycle'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Truck) THEN 'Truck'
                WHEN a.vehicle_ID in (SELECT vehicle_ID FROM Van)   THEN 'Van'
                ELSE 'Other' 
            END) AS vehicle_type,
            (CASE
                WHEN v.gear_type = u.gear_type THEN 2 ELSE 0 END) +
            (CASE
                WHEN v.fuel_type = u.fuel_type THEN 2 ELSE 0 END) +
            (CASE
                WHEN ABS(a.price - u.price) < 5000 THEN 3 ELSE 0 END) +
            (CASE
                WHEN vehicle_type = u.vehicle_type THEN 20 ELSE 0 END) +
            (CASE
                WHEN v.brand = u.brand THEN 3 ELSE 0 END) +
            (CASE
                WHEN v.model = u.model THEN 2 ELSE 0 END) +
            (CASE
                WHEN ABS(v.year - u.year) < 2 THEN 2 ELSE 0 END) +
            (CASE
                WHEN ABS(v.km - u.km) < 70000 THEN 2 ELSE 0 END) +
            (CASE
                WHEN (
                6371 * ACOS(
                    COS(RADIANS(u.latitude)) * COS(RADIANS(a.latitude)) * COS(RADIANS(a.longitude) - RADIANS(u.longitude)) +
                    SIN(RADIANS(u.latitude)) * SIN(RADIANS(a.latitude))
                )
                ) < 400 THEN 6 ELSE 0 END
            ) AS similarity_score
            FROM Ad a
            INNER JOIN Vehicle v ON a.vehicle_ID = v.vehicle_ID
            CROSS JOIN ad_attributes u
            WHERE a.ad_ID NOT IN (SELECT ad_ID FROM user_interactions) AND a.status = 'active' AND a.user_ID != $1
        ),
        distinct_ads AS (
            SELECT 
            ad_ID,
            MAX(similarity_score) AS similarity_score
            FROM similar_ads
            GROUP BY ad_ID
        )
        SELECT Ad.ad_ID, Ad.title, Ad.description, Ad.price, Ad.location, Ad.latitude, Ad.longitude, Ad.date, Ad.status,
               Vehicle.brand, Vehicle.model, Vehicle.year, Ad.vehicle_ID, Vehicle.km, Vehicle.gear_type, Vehicle.fuel_type,
               string_agg(DISTINCT AdImage.image, ',') AS images,
               distinct_ads.similarity_score
        FROM distinct_ads
        JOIN Ad ON Ad.ad_ID = distinct_ads.ad_ID
        JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
        LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
        WHERE Ad.status = 'active'
        GROUP BY Ad.ad_ID, Ad.title, Ad.description, Ad.price, Ad.location, Ad.latitude, Ad.longitude, Ad.date, Ad.status,
             Vehicle.brand, Vehicle.model, Vehicle.year, Ad.vehicle_ID, Vehicle.km, Vehicle.gear_type, Vehicle.fuel_type,
             distinct_ads.similarity_score
        ORDER BY distinct_ads.similarity_score DESC
        LIMIT 8;`,
        [account_id]
        );
        let finalizedAds = res.rows;
        try {
        finalizedAds = await extractImagesFromAds(res.rows);
        } catch (err) {
            console.error("Error on image server fetch: ", err);
        }
        return NextResponse.json({ finalizedAds }, { status: 200 });
    } catch (err) {
        console.error("Error on recommended ads fetch: ", err);
        return NextResponse.json({ message: "Error on recommended ads fetch" }, { status: 500 });
    }
}


