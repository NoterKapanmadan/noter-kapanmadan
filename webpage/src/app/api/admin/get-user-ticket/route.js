import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { extractImagesFromAds } from '@/utils/file';
import { decrypt } from '@/lib/auth';

export async function GET(request) {
    const payload = await decrypt(request.cookies.get("Authorization")?.value);

    if (!payload?.account_id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const countRes = await query(`
          SELECT COUNT(*) as total_count
          FROM Ad
          JOIN Vehicle ON Ad.vehicle_ID = Vehicle.vehicle_ID
          ${whereClause};`,
          params
      );

      return NextResponse.json(
          {
              totalPages,
              vehicleAds: finalizedAds
          },
          { status: 200 }
      );
    }catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}