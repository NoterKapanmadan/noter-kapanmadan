import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';


export async function GET(request) {
    try {
        const { account_id } = await decrypt(request.cookies.get("Authorization").value)

        const currentUser = account_id;

        const result = await query(
            `WITH LatestMessages AS (
                    SELECT
                        chatroom_ID,
                        text AS newest_message,
                        date AS newest_message_date
                    FROM Message
                    WHERE (chatroom_ID, date) IN (
                        SELECT chatroom_ID, MAX(date)
                        FROM Message
                        GROUP BY chatroom_ID
                    )
                    )

                    SELECT c.chatroom_ID,
                    c.account1_ID,
                    c.account2_ID,
                    lm.newest_message,
                    lm.newest_message_date,
                    a1.forename AS account1_forename,
                    a1.surname AS account1_surname,
                    a2.forename AS account2_forename,
                    a2.surname AS account2_surname,
                    u1.profile_image AS account1_profile_image,
                    u2.profile_image AS account2_profile_image

             FROM ChatRoom c
            LEFT JOIN LatestMessages lm ON c.chatroom_ID = lm.chatroom_ID
            JOIN Account a1 ON c.account1_ID = a1.account_ID
            JOIN Users u1 ON a1.account_ID = u1.account_ID
            JOIN Account a2 ON c.account2_ID = a2.account_ID
            JOIN Users u2 ON a2.account_ID = u2.account_ID
             WHERE c.account1_ID = $1 OR c.account2_ID = $1
             ORDER BY lm.newest_message_date DESC;`,
            [currentUser]
        );

        return NextResponse.json(result.rows, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching chatrooms' }, { status: 500 });
    }
}