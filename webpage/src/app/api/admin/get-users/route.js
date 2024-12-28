import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function GET(req) {
    const payload = await decrypt(req.cookies.get("Authorization")?.value);
    const user_ID = payload?.account_ID;
    const isAdmin = payload?.isAdmin;

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get('searchKey')?.trim() || '';

    let sql = `
    SELECT 
      Account.forename, 
      Account.surname, 
      Users.status, 
      Account.account_ID
    FROM Users
    JOIN Account ON Users.account_ID = Account.account_ID
    WHERE Account.account_ID NOT IN (
      SELECT Admin.account_ID FROM Admin
    )
    `;

    const params = [];

    if (searchKey) {
        console.log("bbb", searchKey)
    sql += `
      AND (
        Account.account_ID::text = $1 
        OR CONCAT(Account.forename, ' ', Account.surname) ILIKE '%' || $1 || '%'
      )
    `;
        params.push(searchKey);
    }
    
    try {
        const users = await query(sql, params);
        return NextResponse.json(users.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

