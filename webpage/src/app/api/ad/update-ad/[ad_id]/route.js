import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request, context) {
  try {
    const adID = context.params.ad_id;

    const {title, price, brand, model, year, km, gear_type, fuel_type, description} = await request.json();

    await query("BEGIN");

    await query(
      `UPDATE Ad
      SET title = $1, price = $2, description = $3
      WHERE ad_ID = $4`,
      [title, price, description, adID]
    );

    const { rows } = await query(
      `SELECT vehicle_ID FROM Ad WHERE ad_ID = $1`,
      [adID]
    );

    const vehicleID = rows[0]?.vehicle_ID;
    console.log("vehicleID", vehicleID)

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