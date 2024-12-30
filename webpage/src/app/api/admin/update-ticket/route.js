import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from "@/app/actions";

export async function POST(request) {

  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {

    const req = await request.json();
    const {ticket_id, priority, status} = req;

    await query(`
      UPDATE Tickets
      SET priority = $1, status = $2
      WHERE ticket_ID = $3`,
      [priority, status, ticket_id]
    )

    return NextResponse.json({msg: "Ticket is updated succesfully"}, { status: 200 })
  } catch (error) {
    console.error('Error fetching all tickets:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}