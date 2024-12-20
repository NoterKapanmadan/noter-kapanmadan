import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(req) {
  let transactionStarted = false;

  try {
    const { account_id } = await decrypt(req.cookies.get("Authorization").value);

    const body = await req.json();
    const { ad_ID } = body;

    console.log("deneme", body)

    const ad = await query('SELECT * FROM Ad WHERE ad_ID = $1', [ad_ID]);

    if (ad.rows.length === 0) {
      return NextResponse.json({ message: 'Ad not found' }, { status: 404 });
    }

    await query('BEGIN');
    transactionStarted = true;

    const checkQuery = `
      SELECT *
      FROM Favorites
      WHERE ad_ID = $1 AND account_ID = $2
      FOR UPDATE;
    `;

    const checkResult = await query(checkQuery, [ad_ID, account_id]);

    if (checkResult.rows.length > 0) {
      const deleteQuery = `
        DELETE FROM Favorites
        WHERE ad_ID = $1 AND account_ID = $2;
      `;
      await query('COMMIT');
      await query(deleteQuery, [ad_ID, account_id]);

      return NextResponse.json({ message: 'Removed from favorites!' }, { status: 200 });
    } else {
      const insertQuery = `
        INSERT INTO Favorites (ad_ID, account_ID)
        VALUES ($1, $2);
      `;
      await query('COMMIT');
      await query(insertQuery, [ad_ID, account_id]);

      return NextResponse.json({ message: 'Added to favorites!' }, { status: 200 });
    }
  } catch (e) {
    if (transactionStarted) {
      await query('ROLLBACK');
    }

    console.error(e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
