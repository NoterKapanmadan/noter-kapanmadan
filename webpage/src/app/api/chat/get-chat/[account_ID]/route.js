import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function GET(request, context) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const currentUser = account_id;
        const otherUser = context.params.account_ID;

        const result = await query(
            `SELECT *
             FROM Message
             WHERE (sender_ID = $1 AND chatroom_ID IN (
                       SELECT chatroom_ID FROM ChatRoom 
                       WHERE (account1_ID = $1 AND account2_ID = $2) OR (account1_ID = $2 AND account2_ID = $1)))
                OR (sender_ID = $2 AND chatroom_ID IN (
                       SELECT chatroom_ID FROM ChatRoom 
                       WHERE (account1_ID = $1 AND account2_ID = $2) OR (account1_ID = $2 AND account2_ID = $1)))
             ORDER BY date DESC`,
            [currentUser, otherUser]
        );

        return NextResponse.json(result.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 });
    }
}