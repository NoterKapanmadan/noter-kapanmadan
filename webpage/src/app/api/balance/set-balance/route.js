import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const req = await request.json();
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)
        console.log(req.diff)
        const diff = req.diff;
        const transaction_id = uuidv4();
        if(diff < 0) {
            const res = await query(
                'INSERT INTO transaction (transaction_ID,sender_ID, amount) VALUES ($1, $2, $3)',
                [transaction_id,account_id, -diff]
            );
        }
        else {
            const res = await query(
                'INSERT INTO transaction (transaction_ID, receiver_ID, amount) VALUES ($1, $2, $3)',
                [transaction_id,account_id, diff]
            );
        }
        return NextResponse.json({ message: 'Balance updated' }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error updating balance' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const res = await query(
            'SELECT balance FROM users WHERE account_id = $1',
            [account_id]
        );
        return NextResponse.json(res.rows[0], { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching balance' }, { status: 500 });
    }
}