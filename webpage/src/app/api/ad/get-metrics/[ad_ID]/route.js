import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request, context) {
  const adID = context.params.ad_ID;

  try {
    await query('BEGIN');

    const views = await query(`
      SELECT views_count
      FROM Ad
      WHERE ad_ID = $1
    `, [adID]);

    const favoritesCount = await query(`
      SELECT COUNT(*) AS total_favorites
      FROM Favorites
      WHERE ad_ID = $1
    `, [adID]);

    await query('COMMIT');

    const viewCount = views.rows[0].views_count;
    const favCount = favoritesCount.rows[0].total_favorites;

    return NextResponse.json(
      {
        views: viewCount,
        favorites: favCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}