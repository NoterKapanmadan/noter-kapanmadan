import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function GET(req) {
    try {
        const payload = await decrypt(req.cookies.get("Authorization")?.value);
        const user_ID = payload.account_ID;
        const isAdmin = payload.isAdmin;
        
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(req.url);
        const searchKey = searchParams.get('searchKey')?.trim() || '';

        let sql = `
        SELECT transaction_ID, date, amount, receiver_ID, sender_ID
        FROM Transaction
        `;

        const params = [];

        if (searchKey) {
            console.log("bbb", searchKey)
            sql += `
              WHERE transaction_ID::text = $1 OR receiver_ID::text = $1 OR sender_ID::text = $1
            `;
            params.push(searchKey);
        }

        sql += " ORDER BY date DESC";
        
        const transactions = await query(sql, params)
        const finalTransactions = transactions.rows.map(transaction => ({
            ...transaction,
            type: transaction.sender_id === null ? 'Deposit' : transaction.receiver_id === null ? 'Withdraw' : 'Transfer'
        }))
        
        return NextResponse.json(finalTransactions, {status: 200});
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
    
        