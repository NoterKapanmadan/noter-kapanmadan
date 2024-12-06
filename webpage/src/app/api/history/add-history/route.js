import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function POST(request) {
    try {
        const req = await request.json();
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        //check if user has already seen the ad
        const history = await query(
            `SELECT * FROM visits WHERE ad_id = $1 AND account_id = $2`,
            [req.adID, account_id]
        );
        if (history.rows.length > 0) {
            //update the timestamp
            await query(
                `UPDATE visits SET visit_date = CURRENT_TIMESTAMP WHERE ad_id = $1 AND account_id = $2`,
                [req.adID, account_id]
            );
        }
        else {
            await query(
                `INSERT INTO visits (ad_id, account_id)
                VALUES ($1, $2)`,
                [req.adID, account_id]
            );
        }
        return NextResponse.json({ message: 'History added' });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error adding history' });
    }
}