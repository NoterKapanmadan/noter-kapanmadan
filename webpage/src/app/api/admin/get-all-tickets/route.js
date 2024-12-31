// File: src/app/api/admin/get-all-tickets/route.js

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { decrypt } from '@/lib/auth'
import { isAdmin } from "@/app/actions";

export async function GET(request) {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log("merhaba")
  try {
    await query('BEGIN');

    const totalRes = await query(`
      SELECT COUNT(*) AS "totalTickets"
      FROM Tickets
    `)

    const pendingRes = await query(`
      SELECT COUNT(*) AS "pendingTickets"
      FROM Tickets
      WHERE status = 'Open'
    `)

    const closedRes = await query(`
      SELECT COUNT(*) AS "closedTickets"
      FROM Tickets
      WHERE status = 'Closed'
    `)

    const ticketsRes = await query(`
      SELECT 
        t.ticket_ID,
        t.subject,
        t.description,
        t.priority,
        t.status,
        t.created_date,
        a.forename,
        a.surname,
        u.profile_image
      FROM Tickets t
      JOIN Account a ON t.account_ID = a.account_ID
      JOIN Users u ON a.account_ID = u.account_ID
      ORDER BY t.created_date DESC
    `)

    await query('COMMIT');

    const totalTickets = parseInt(totalRes.rows[0]?.totalTickets || '0', 10)
    const pendingTickets = parseInt(pendingRes.rows[0]?.pendingTickets || '0', 10)
    const closedTickets = parseInt(closedRes.rows[0]?.closedTickets || '0', 10)

    console.log("merhaba")

    const responseData = {
      stats: {
        totalTickets,
        pendingTickets,
        closedTickets
      },
      tickets: ticketsRes.rows
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching all tickets:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}