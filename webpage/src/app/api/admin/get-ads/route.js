import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function GET(req) {
    const payload = await decrypt(req.cookies.get("Authorization")?.value);
    const isAdmin = payload?.isAdmin;

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get('searchKey')?.trim() || '';

    let sql = `
    SELECT
        Ad.ad_ID as id,
        Ad.title,
        Ad.status
    FROM Ad
    `;
    const params = [];

    if (searchKey) {
        sql += `
        WHERE Ad.ad_ID::text = $1
        OR Ad.title ILIKE '%' || $1 || '%'
        `;
        params.push(searchKey);
    }
    try {
        const ads = await query(sql, params);
        return NextResponse.json(ads.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}