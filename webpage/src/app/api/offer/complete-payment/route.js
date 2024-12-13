import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function POST(req) {
    try {
        // Decrypt and get the account_id from the Authorization cookie
        const { account_id } = await decrypt(req.cookies.get("Authorization").value);

        // Parse the request body
        const body = await req.json();
        const { bid_ID } = body;

        // Fetch the bid details
        const bid = await query('SELECT * FROM Bid WHERE bid_ID = $1', [bid_ID]);

        if (bid.rows.length === 0) {
            return NextResponse.json({ message: 'Bid not found' }, { status: 404 });
        }

        const bidDetails = bid.rows[0];

        // Check if the bid status is 'accepted'
        if (bidDetails.status !== 'accepted') {
            return NextResponse.json({ message: 'Bid is not accepted' }, { status: 400 });
        }

        // Fetch the buyer's (bidder's) balance
        const buyer = await query('SELECT balance FROM Users WHERE account_ID = $1', [bidDetails.user_id]);

        if (buyer.rows.length === 0) {
            return NextResponse.json({ message: 'Buyer not found' }, { status: 404 });
        }

        const buyerBalance = parseFloat(buyer.rows[0].balance);

        // Check if the buyer has enough balance
        if (buyerBalance < parseFloat(bidDetails.amount)) {
            return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
        }

        // Fetch the seller's (ad owner) account ID
        const ad = await query('SELECT user_ID FROM Ad WHERE ad_ID = $1', [bidDetails.ad_id]);

        if (ad.rows.length === 0) {
            return NextResponse.json({ message: 'Ad not found' }, { status: 404 });
        }

        const sellerID = ad.rows[0].user_id;

        // Create a transaction
        await query(
            'INSERT INTO Transaction (transaction_ID, bid_ID, sender_ID, receiver_ID, amount) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
            [bid_ID, bidDetails.user_id, sellerID, bidDetails.amount]
        );


        // Update the bid status to 'completed'
        await query('UPDATE Bid SET status = $1 WHERE bid_ID = $2', ['completed', bid_ID]);

        return NextResponse.json({ message: 'Payment completed successfully' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error completing the payment' }, { status: 500 });
    }
}
