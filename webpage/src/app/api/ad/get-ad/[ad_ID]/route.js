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
                Users.profile_image as profilePhoto
            FROM Ad 
            JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
            LEFT JOIN AdImage ON Ad.ad_ID = AdImage.ad_ID
            JOIN Users ON Ad.user_ID = Users.account_ID
            JOIN Account ON Users.account_ID = Account.account_ID
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
                Users.profile_image`,
            [ad_ID]
        );
        
        const finalizedAd = await extractImagesFromAd(ad.rows[0]);
        console.log("finalizedAd", finalizedAd);
        const profilePhoto = finalizedAd.profilephoto;
        let imageSrc = null;
        
        imageSrc = await getImageSrc(profilePhoto);
        console.log("hwllo");
            
        

        const adData = {
            ...finalizedAd,
            profilePhotoData: imageSrc ? imageSrc : null,
        };

        return NextResponse.json(adData, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
