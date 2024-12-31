import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from "@/app/actions";

export async function GET(request, context) {
  console.log("merhaba")
  
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ticketID = context.params.ticketID;

  try {
    const ticket = await query(
      `
      SELECT *
      FROM ticket_view
      WHERE ticket_ID = $1
      `,
      [ticketID]
    );

    return NextResponse.json(
      {
        ticket: ticket,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching user tickets:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}