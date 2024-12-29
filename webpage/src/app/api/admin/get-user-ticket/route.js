import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { decrypt } from '@/lib/auth'

export async function GET(request) {
  const payload = await decrypt(request.cookies.get("Authorization")?.value);
  if (!payload?.account_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const ticketsRes = await query(
      `
      SELECT subject, description, status, created_date
      FROM Tickets
      WHERE account_ID = $1
      ORDER BY created_date DESC
      `,
      [payload.account_id]
    );

    return NextResponse.json(
      {
        tickets: ticketsRes.rows,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching user tickets:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}