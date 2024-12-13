import { decrypt } from '@/lib/auth';
import { NextResponse } from 'next/server'
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const res = await query(
            `SELECT t.transaction_ID, t.date, t.sender_ID, t.receiver_ID, t.amount, a.ad_ID
            FROM transaction as t LEFT JOIN bid as b ON t.bid_ID = b.bid_ID LEFT JOIN ad as a ON b.ad_ID = a.ad_ID
            WHERE t.sender_ID = $1 or t.receiver_ID = $1
            ORDER BY t.date DESC`,
            [account_id]
        );  
        return NextResponse.json(res.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
    }
}