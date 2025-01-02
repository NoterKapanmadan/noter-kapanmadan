import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request) {
  const { adID } = await request.json();
  
  try {
    await query(`
      UPDATE Ad
      SET views_count = views_count + 1
      WHERE ad_ID = $1
    `, [adID]);

    return NextResponse.json(
      { msg: 'View count incremented successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}