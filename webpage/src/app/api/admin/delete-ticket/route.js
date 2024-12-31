import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from "@/app/actions";

export async function POST(request) {

  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {

    const {ticketID} = await request.json();

    await query(`
      DELETE FROM Tickets
      WHERE ticket_ID = $1`,
      [ticketID]
    )

    return NextResponse.json({msg: "Ticket is deleted succesfully"}, { status: 200 })
  } catch (error) {
    console.error('Error fetching all tickets:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}