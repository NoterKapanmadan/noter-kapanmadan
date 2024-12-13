import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        // Decrypt and get the account_id from the Authorization cookie
        const { account_id } = await decrypt(req.cookies.get("Authorization").value);

        // Parse the request body for offer details
        const { ad_id, amount } = await req.json();

        // Validate the input
        if (!ad_id || !amount || amount <= 0) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

        // Check if the ad exists and is active
        const adCheckQuery = `SELECT status FROM Ad WHERE ad_ID = $1`;
        const adCheckResult = await query(adCheckQuery, [ad_id]);

        if (adCheckResult.rowCount === 0 || adCheckResult.rows[0].status !== 'active') {
            return NextResponse.json({ message: 'Ad not found or not active' }, { status: 404 });
        }

        // Check if the user is making an offer on their own ad
        const userCheckQuery = `SELECT user_ID FROM Ad WHERE ad_ID = $1`;
        const userCheckResult = await query(userCheckQuery, [ad_id]);
        

        if (userCheckResult.rows[0].user_id === account_id) {
            return NextResponse.json({ message: 'Cannot send an offer to your own ad' }, { status: 400 });
        }

        // Insert the bid into the database
        const bidId = uuidv4();
        const insertBidQuery = `
            INSERT INTO Bid (bid_ID, user_ID, ad_ID, amount, status) 
            VALUES ($1, $2, $3, $4, 'pending')
        `;
        await query(insertBidQuery, [bidId, account_id, ad_id, amount]);

        // Return success response
        return NextResponse.json({ message: 'Offer sent successfully', bidId });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error sending offer' }, { status: 500 });
    }
}
