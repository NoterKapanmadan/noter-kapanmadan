import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function GET(request) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const currentUser = account_id;

        const result = await query(
            `SELECT c.chatroom_ID, 
                    c.account1_ID, 
                    c.account2_ID, 
                    m.text AS newest_message, 
                    m.date AS newest_message_date
             FROM ChatRoom c
             LEFT JOIN (
                 SELECT chatroom_ID, text, date
                 FROM Message
                 WHERE date = (SELECT MAX(date) FROM Message WHERE chatroom_ID = Message.chatroom_ID)
             ) m ON c.chatroom_ID = m.chatroom_ID
             WHERE c.account1_ID = $1 OR c.account2_ID = $1
             ORDER BY m.date DESC`,
            [currentUser]
        );

        return NextResponse.json(result.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching chatrooms' }, { status: 500 });
    }
}