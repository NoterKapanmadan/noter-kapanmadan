import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(req) {
    try {
        const payload = await decrypt(req.cookies.get("Authorization")?.value);
        const isAdmin = payload.isAdmin;
        const request = await req.json(); 
        const banned_ad_id = request.id;
        const status = request.status;
        if (!banned_ad_id) {
            return NextResponse.json({ error: 'Please provide an ad ID' }, { status: 400 })
        }
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        const res = await query(
            `UPDATE Ad
            SET status = $1
            WHERE ad_ID = $2;`,
            [status, banned_ad_id]
        );
        return NextResponse.json({ message: 'Ad status has been updated' }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

}