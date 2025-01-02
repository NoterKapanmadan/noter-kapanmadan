import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function POST(request) {
    try {
        const req = await request.json();
        const { account_id, isAdmin } = await decrypt(request.cookies.get("Authorization").value)
        if(isAdmin) {
            console.log('Admins cannot visit ads')
            return NextResponse.json({ message: 'Admins cannot visit ads' }, { status: 403 });
        }
        //check if user has already seen the ad
        const history = await query(
            `SELECT * FROM Visits WHERE ad_ID = $1 AND account_ID = $2`,
            [req.adID, account_id]
        );
        console.log(history.rows)
        if (history.rows.length > 0) {
            //update the timestamp
            await query(
                `UPDATE Visits SET visit_date = CURRENT_TIMESTAMP WHERE ad_ID = $1 AND account_ID = $2`,
                [req.adID, account_id]
            );
        }
        else {
            //we need to check whether this ad is owned by the visited user or not. If it is, we don't want to add it to the history
            const ad = await query(
                `SELECT * FROM Ad WHERE ad_ID = $1 AND user_ID = $2`,
                [req.adID, account_id]
            );
            if (ad.rows.length > 0) {
                console.log('Ad is owned by the user')
                return NextResponse.json({ message: 'Ad is owned by the user' }, { status: 403 });
            }
            //add the ad to the history
            await query(
                `INSERT INTO visits (ad_ID, account_ID)
                VALUES ($1, $2)`,
                [req.adID, account_id]
            );
            console.log('History added')
        }
        return NextResponse.json({ message: 'History added' }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error adding history' }, { status: 500 });
    }
}