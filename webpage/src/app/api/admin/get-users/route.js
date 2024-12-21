import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function GET(req) {
    const payload = await decrypt(req.cookies.get("Authorization")?.value);
    const user_ID = payload.account_ID;
    const isAdmin = payload.isAdmin;
    const request = await req.json();
    const searchKey = request.body.searchKey || '';
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    try {
        const users = await query(
            `SELECT forename, surname, status, account_ID
            FROM Users JOIN Accounts ON Users.account_ID = Accounts.account_ID
            WHERE (account_ID = $2 OR CONCAT(name, ' ', surname) ILIKE) AND account_ID not IN ( SELECT account_ID FROM Admin)`,
            [user_ID,searchKey]
        );
        return NextResponse.json(users.rows, {status: 200});
    }
    catch (e) {
        console.error(e);
       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

