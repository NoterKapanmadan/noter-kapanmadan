import { NextResponse } from 'next/server';
import { decrypt, getAuthToken } from "@/lib/auth";
import { query } from '@/lib/db';

export async function POST(request, context) {
  try {
    const token = getAuthToken();
    const payload = await decrypt(token);

    const adID = context.params.ad_ID;

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

    await query("BEGIN");

    await query(
      `DELETE FROM Vehicle
      WHERE vehicle_ID = $1`,
      [vehicleID]
    );

    await query(
      `DELETE FROM AdImage 
      WHERE ad_ID = $1`,
      [adID]
    );

    await query(
      `DELETE FROM Ad
      WHERE ad_ID = $1`,
      [adID]
    );

    await query("COMMIT");

    return NextResponse.json(
      { msg: "Ad is deleted successfully!" },
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