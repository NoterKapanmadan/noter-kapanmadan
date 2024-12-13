import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const req = await request.json();
        const sender_ID = req.body.sender_ID;
        const receiver_ID = req.body.receiver_ID;
        const amount = req.body.amount;
        const transaction_id = uuidv4();
        const res = await query(
            'INSERT INTO transaction (transaction_ID, sender_ID, receiver_ID, amount) VALUES ($1, $2, $3, $4)',
            [transaction_id, sender_ID, receiver_ID, amount]
        );
        return NextResponse.json({ message: 'Transaction created' }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error creating transaction' }, { status: 500 });
    }
}
