import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        // Decrypt and get the account_id from the Authorization cookie
        const { account_id } = await decrypt(req.cookies.get("Authorization").value);

        // Parse the incoming request body
        const { evaluated_id, comment, point } = await req.json();

        // Validate the input
        if (!evaluated_id || !comment || !point) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

        await query(
            `INSERT INTO Evaluates (evaluater_ID, evaluated_ID, comment, point) 
             VALUES ($1, $2, $3, $4)`,
            [account_id, evaluated_id, comment, point]
        );

        // Return success response
        return NextResponse.json({ message: 'Rating added successfully' }, { status: 200 });
    } catch (e) {
        console.error(e);

        if (e.code === 'P0001') { // PostgreSQL foreign key violation
            return NextResponse.json({ message: 'No transaction exists between the users' }, { status: 400 });
        } else if (e.code === '23514') { // PostgreSQL check constraint violation
            return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 });
        }
        else if (e.code === '23505') { // PostgreSQL unique constraint violation
            return NextResponse.json({ message: 'Rating already exists' }, { status: 400 });
        }

        // General error fallback
        return NextResponse.json({ message: 'Error adding rating' }, { status: 500 });
    }
}
