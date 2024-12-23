import { NextResponse } from 'next/server';
import { decrypt, getAuthToken } from "@/lib/auth";
import { query } from '@/lib/db';
import { uploadFilesServer } from '@/utils/file';

export async function POST(request, context) {
  try {
    const token = getAuthToken();
    const payload = await decrypt(token);

    const adID = context.params.ad_id;

    const { rows } = await query(
      `SELECT vehicle_ID, user_ID FROM Ad WHERE ad_ID = $1`,
      [adID]
    );

    const {
      user_id: adUserID,
      vehicle_id: vehicleID
    } = rows[0];

    if (payload.account_id !== adUserID) {
      return NextResponse.json(
        { error: "You are not authorized to edit this ad" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll("images");
    console.log(images)

    if(images) {
      const { imageIds } = await uploadFilesServer(images);

      await query("BEGIN");

      await query(
        `DELETE FROM AdImage
        WHERE ad_ID = $1`,
        [adID]
      );

      await query(
        `INSERT INTO AdImage (ad_ID, image)
        VALUES 
        ${imageIds.map((_, index) => `($1, $${index + 2})`).join(', ')};`,
        [adID, ...imageIds]
    );

      await query("COMMIT");

      return NextResponse.json(
        { msg: "Ad is updated successfully!" },
        { status: 200 }
      );
    }

    const data = Object.fromEntries(formData.entries());
    const {
      title,
      price,
      brand,
      model,
      year,
      km,
      gearType: gear_type,
      fuelType: fuel_type,
      location,
      latitude,
      longitude,
      description
    } = data;

    await query("BEGIN");

    await query(
      `UPDATE Ad
      SET title = $1, price = $2, description = $3, location = $5, latitude = $6, longitude = $7
      WHERE ad_ID = $4`,
      [title, price, description, adID, location, latitude, longitude]
    );

    await query(
      `UPDATE Vehicle
      SET brand = $1, model = $2, year = $3, km = $4, gear_type = $5, fuel_type = $6
      WHERE vehicle_ID = $7`,
      [brand, model, year, km, gear_type, fuel_type, vehicleID]
    );

    await query("COMMIT");

    return NextResponse.json(
      { msg: "Ad is updated successfully!" },
      { status: 200 }
    );
  } catch(err) {
    console.log("error", err)
    await query("ROLLBACK");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}