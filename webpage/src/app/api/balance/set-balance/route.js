import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(request) {
    try {
        const req = await request.json();
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)
        console.log(req.diff)
        const diff = req.diff;

        const res = await query(
            'UPDATE users SET balance = balance + $1 WHERE account_id = $2',
            [diff, account_id]
        );
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