import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getImageSrc } from '@/utils/file';

export async function GET(req, context) {
    try {
        // Get the evaluated user ID from query parameters
        const evaluated_id = context.params.evaluated_id;

        if (!evaluated_id) {
            return NextResponse.json({ message: 'Missing evaluated_id parameter' }, { status: 400 });
        }

    // Query the database for evaluations and average rating
    const evaluations = await query(
        `SELECT 
            e.comment,
            e.comment_date,
            e.point,
            a.forename AS evaluater_forename,
            a.surname AS evaluater_surname,
            u.profile_image AS evaluater_profile_image,
            AVG(e.point) OVER () AS average_rating
        FROM Evaluates e
        INNER JOIN Users u ON e.evaluater_ID = u.account_ID
        INNER JOIN Account a ON e.evaluater_ID = a.account_ID
        WHERE e.evaluated_ID = $1`,
        [evaluated_id]
    );

    if (evaluations.length === 0) {
        return NextResponse.json({ message: 'No evaluations found for this user', evaluations: [], average_rating: 0 });
    }

    console.log(evaluations);
    // Extract the average rating from the first row
    const average_rating = evaluations.rows[0].average_rating;


    // Format the response
    evaluations.rows = evaluations.rows.map(row => ({
        comment: row.comment,
        comment_date: row.comment_date,
        point: row.point,
        evaluator_forename: row.evaluater_forename,
        evaluator_surname: row.evaluater_surname,
        evaluator_profile_image: getImageSrc(row.evaluater_profile_image, 'low')
    }));




    // Return the evaluations and average rating
    return NextResponse.json({ evaluations: evaluations.rows, average_rating });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching evaluations' }, { status: 500 });
    }
}
