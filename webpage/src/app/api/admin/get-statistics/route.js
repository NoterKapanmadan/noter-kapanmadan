import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';

export async function GET(req) {
  try {
    const payload = await decrypt(req.cookies.get("Authorization")?.value);
    const isAdmin = payload?.isAdmin;

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const res = await query(
        `
        BEGIN;

        -- Query 1: Total ads and active ads
        SELECT
            COUNT(*) as total_ads,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_ads
        FROM Ad;

        -- Query 2: Total users excluding admins
        SELECT 
            COUNT(*) as total_users
        FROM Users
        WHERE account_ID NOT IN (SELECT account_ID FROM Admin);

        -- Query 3: Total transactions
        SELECT
            COUNT(*) as total_transactions
        FROM Transaction;

        -- Query 4 : Total view counts for ads
        SELECT
            COUNT(views_count) as total_views
            FROM Ad;

        -- Query 5: Number of bids
        SELECT
            COUNT(*) as total_bids
            FROM Bid;

        -- Query 6: Number of tickets
        SELECT
            COUNT(*) as total_tickets
            FROM Tickets;

        -- Query 7: Number of messages
        SELECT
            COUNT(*) as total_messages
            FROM Message;

        -- Query 8: Average rating of users
        WITH avg_user_rating AS (
            SELECT
                AVG(point) as average_user_rating
            FROM Evaluates
            GROUP BY evaluated_ID
        )
        SELECT
            AVG(average_user_rating) as average_rating
            FROM avg_user_rating;
        
        -- Query 9: Monthly counts for ads, users, and transactions
        (
            SELECT 
                'ads' AS table_name,
                TO_CHAR(date, 'YYYY-MM') AS month,
                COUNT(*) AS count
            FROM Ad
            WHERE date >= NOW() - INTERVAL '5 months'
            GROUP BY TO_CHAR(date, 'YYYY-MM')

            UNION ALL

            SELECT 
                'users' AS table_name,
                TO_CHAR(registration_date, 'YYYY-MM') AS month,
                COUNT(*) AS count
            FROM Account
            WHERE registration_date >= NOW() - INTERVAL '5 months'
            AND account_ID NOT IN (SELECT account_ID FROM Admin)
            GROUP BY TO_CHAR(registration_date, 'YYYY-MM')

            UNION ALL

            SELECT 
                'transactions' AS table_name,
                TO_CHAR(date, 'YYYY-MM') AS month,
                COUNT(*) AS count
            FROM Transaction
            WHERE date >= NOW() - INTERVAL '5 months'
            GROUP BY TO_CHAR(date, 'YYYY-MM')
        )
        ORDER BY table_name, month ASC;

        COMMIT;

        `
    );
    // Combine all the data into a single object

    const data = {
        total_ads: res[1].rows[0].total_ads,
        active_ads: res[1].rows[0].active_ads,
        total_users: res[2].rows[0].total_users,
        total_transactions: res[3].rows[0].total_transactions,
        total_views: res[4].rows[0].total_views,
        total_bids: res[5].rows[0].total_bids,
        total_tickets: res[6].rows[0].total_tickets,
        total_messages: res[7].rows[0].total_messages,
        average_rating: res[8].rows[0].average_rating,
        monthly_counts: res[9].rows
    }
    //concatinate all data into each individual month value if value do not exist, then assign zero
    let monthData = {};
    data.monthly_counts.forEach((entry) => {
        if (!monthData[entry.month]) {
            monthData[entry.month] = {
                ads: 0,
                users: 0,
                transactions: 0
            }
        }
        monthData[entry.month][entry.table_name] = Number(entry.count);
    });
    data.monthly_counts = Object.keys(monthData).map((month) => {
        return {
            month,
            ...monthData[month]
        }
    });
    
    return NextResponse.json(data, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


