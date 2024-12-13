import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(req) {
    try {
        // Decrypt and get the account_id from the Authorization cookie
        const { account_id } = await decrypt(req.cookies.get("Authorization").value);

        // Parse the request body
        const body = await req.json();
        const { bid_ID, action } = body;

        // Validate action
        if (!['accept', 'reject'].includes(action)) {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        // Fetch the bid details
        const bid = await query('SELECT * FROM Bid WHERE bid_ID = $1', [bid_ID]);

        if (bid.rows.length === 0) {
            return NextResponse.json({ message: 'Bid not found' }, { status: 404 });
        }

        const bidDetails = bid.rows[0];

        if(bidDetails.status !== 'pending') {
            return NextResponse.json({ message: 'Bid has already been evaluated' }, { status: 400 });
        }

        // Check if the user owns the ad
        const ad = await query('SELECT * FROM Ad WHERE ad_ID = $1 AND user_ID = $2', [bidDetails.ad_id, account_id]);

        if (ad.rows.length === 0) {
            return NextResponse.json({ message: 'Unauthorized action' }, { status: 403 });
        }

        if (action === 'accept') {
            // Update bid status to accepted
            await query('UPDATE Bid SET status = $1 WHERE bid_ID = $2', ['accepted', bid_ID]);

            return NextResponse.json({ message: 'Offer accepted' });
        } else if (action === 'reject') {
            // Update bid status to rejected
            await query('UPDATE Bid SET status = $1 WHERE bid_ID = $2', ['rejected', bid_ID]);

            return NextResponse.json({ message: 'Offer rejected' });
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error processing the offer' }, { status: 500 });
    }
}
