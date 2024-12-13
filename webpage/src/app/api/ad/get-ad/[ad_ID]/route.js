import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { extractImagesFromAd, getImageSrc } from '@/utils/file';

export async function GET(req, context) {
    const ad_ID = context.params.ad_ID;

    try {
        const ad = await query(
            `SELECT 
                Ad.title, 
                Ad.description, 
                Ad.price, 
                Ad.location, 
                Ad.date, 
                Ad.status, 
                Vehicle.brand, 
                Vehicle.model, 
                Vehicle.year, 
                Ad.vehicle_ID, 
                Vehicle.km, 
                Vehicle.gear_type, 
                Vehicle.fuel_type,
                string_agg(AdImage.image, ',') as images,
                Account.forename as name, 
                Account.surname as surname,
                Account.account_ID as account_ID,
                Account.phone_number as phone_number,
                Account.email as email,
                Users.profile_image as profilePhoto,
                -- Specific vehicle details
                Car.seat_count,
                Car.body_type,
                Truck.load_capacity,
                Truck.traction_type,
                Van.roof_height,
                Van.bed_capacity,
                Motorcycle.engine_capacity,
                Motorcycle.cylinder_count
            FROM Ad 
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            JOIN Users ON Ad.user_ID = Users.account_ID
            JOIN Account ON Users.account_ID = Account.account_ID
            LEFT JOIN Car ON Vehicle.vehicle_ID = Car.vehicle_ID
            LEFT JOIN Truck ON Vehicle.vehicle_ID = Truck.vehicle_ID
            LEFT JOIN Van ON Vehicle.vehicle_ID = Van.vehicle_ID
            LEFT JOIN Motorcycle ON Vehicle.vehicle_ID = Motorcycle.vehicle_ID
            WHERE Ad.ad_ID = $1
            GROUP BY 
                Ad.title, 
                Ad.description, 
                Ad.price, 
                Ad.location, 
                Ad.date, 
                Ad.status, 
                Vehicle.brand, 
                Vehicle.model, 
                Vehicle.year, 
                Ad.vehicle_ID, 
                Vehicle.km, 
                Vehicle.gear_type, 
                Vehicle.fuel_type, 
                Account.forename, 
                Account.surname,
                Account.account_ID,
                Account.phone_number,
                Account.email,
                Users.profile_image,
                Car.seat_count,
                Car.body_type,
                Truck.load_capacity,
                Truck.traction_type,
                Van.roof_height,
                Van.bed_capacity,
                Motorcycle.engine_capacity,
                Motorcycle.cylinder_count;`,
            [ad_ID]
        );
        
        const finalizedAd = await extractImagesFromAd(ad.rows[0]);
        //console.log("finalizedAd", finalizedAd);
        const profilePhoto = finalizedAd.profilephoto;

        let specificDetails = {};
        if (ad.rows[0].seat_count !== null) {
            specificDetails = {
                type: "Car",
                seatCount: ad.rows[0].seat_count,
                bodyType: ad.rows[0].body_type,
            };
        } else if (ad.rows[0].load_capacity !== null) {
            specificDetails = {
                type: "Truck",
                loadCapacity: ad.rows[0].load_capacity,
                tractionType: ad.rows[0].traction_type,
            };
        } else if (ad.rows[0].roof_height !== null) {
            specificDetails = {
                type: "Van",
                roofHeight: ad.rows[0].roof_height,
                bedCapacity: ad.rows[0].bed_capacity,
            };
        } else if (ad.rows[0].engine_capacity !== null) {
            specificDetails = {
                type: "Motorcycle",
                engineCapacity: ad.rows[0].engine_capacity,
                cylinderCount: ad.rows[0].cylinder_count,
            };
        }

        let imageSrc = null;
        
        imageSrc = await getImageSrc(profilePhoto);
        //console.log("hwllo");
            
        

        const adData = {
            ...finalizedAd,
            profilePhotoData: imageSrc ? imageSrc : null,
            vehicleDetails: specificDetails,
        };

        return NextResponse.json(adData, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
