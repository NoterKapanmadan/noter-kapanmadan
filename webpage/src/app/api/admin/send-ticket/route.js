// File: src/app/api/admin/send-ticket/route.js

import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(request) {
  const payload = await decrypt(request.cookies.get("Authorization")?.value);

  if (!payload?.account_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const subject = formData.get("subject")
    const description = formData.get("description")

    console.log(subject)

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Fields 'subject' and 'description' are required." },
        { status: 400 }
      );
    }
    const res = await query(
      `
      SELECT account_ID
      FROM Admin
      WHERE account_ID = $1
      `,
      [payload.account_id]
    );

    if (res.rows.length > 0) {
      return NextResponse.json({ error: 'Admin cannot send ticket' }, { status: 403 });
    }

    const ticketID = uuidv4();

    const insertedTicket = await query(
      `
      INSERT INTO Tickets (
        ticket_ID, 
        account_ID, 
        subject, 
        description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING * 
      `,
      [ticketID, payload.account_id, subject, description]
    );

    if (insertedTicket.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to send ticket.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        msg: 'Ticket sent successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}