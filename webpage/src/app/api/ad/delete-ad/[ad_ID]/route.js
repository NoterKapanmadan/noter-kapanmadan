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

    const {rows: typeRows} = await query(
      `SELECT 'car' AS type FROM Car WHERE vehicle_ID = $1
        UNION
        SELECT 'truck' FROM Truck WHERE vehicle_ID = $1
        UNION
        SELECT 'van' FROM Van WHERE vehicle_ID = $1
        UNION
        SELECT 'motorcycle' FROM Motorcycle WHERE vehicle_ID = $1;`,
        [vehicleID]
      );

      const {type} = typeRows[0];

    await query("BEGIN");

    switch (type) {
      case 'car':
        await query(
          `DELETE FROM Car WHERE vehicle_ID = $1`,
          [vehicleID]
        );
        break;
      case 'truck':
        await query(
          `DELETE FROM Truck WHERE vehicle_ID = $1`,
          [vehicleID]
        );
        break;
      case 'van':
        await query(
          `DELETE FROM Van WHERE vehicle_ID = $1`,
          [vehicleID]
        );
        break;
      case 'motorcyle':
        await query(
          `DELETE FROM Motorcycle WHERE vehicle_ID = $1`,
          [vehicleID]
        );
        break;
      default:
        throw new Error("Unknown vehicle type");
    }

    await query(
      `DELETE FROM AdImage 
      WHERE ad_ID = $1`,
      [adID]
    );

    await query(
      `DELETE FROM Favorites
      WHERE ad_ID = $1`,
      [adID]
    );

    await query(
      `DELETE FROM Visits
      WHERE ad_ID = $1`,
      [adID]
    );

    await query(
      `DELETE FROM Ad
      WHERE ad_ID = $1`,
      [adID]
    );

    await query(
      `DELETE FROM Vehicle
      WHERE vehicle_ID = $1`,
      [vehicleID]
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