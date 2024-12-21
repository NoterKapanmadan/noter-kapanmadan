import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function GET(req) {
    try {
        const payload = await decrypt(req.cookies.get("Authorization")?.value);
        const user_ID = payload.account_ID;
        const isAdmin = payload.isAdmin;
        const request = await req.json();
        const searchKey = request.body.searchKey || '';
        if (!isAdmin) {
            return NextResponse.forbidden("You are not authorized to access this page")
        }
        const transactions = await query(
            `SELECT transaction_ID, date, amount, receiver_ID, sender_ID
            FROM Transaction
            WHERE (transaction_ID = $1)`,
            [searchKey]
        );
        
        if(transactions.rows.length === 0){
            return NextResponse.notFound("No transactions found")
        }
        return NextResponse.json(transactions.rows, {status: 200});
    }
    catch (e) {
        console.error(e);
        return NextResponse.internalServerError("Error fetching transactions")
    }
}
    
        