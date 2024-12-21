import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(req) {
    try {
        const payload = await decrypt(req.cookies.get("Authorization")?.value);
        const isAdmin = payload.isAdmin;
        const request = await req.json()
        const banned_user_id = request.body.bannedUser
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const res = await query(
            `UPDATE Users
            SET status = 'banned'
            WHERE account_ID = $1 AND account_ID not in (SELECT account_ID FROM Admin)'`,
            [banned_user_id]
        );

        return NextResponse.json({ message: 'User has been banned' }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}