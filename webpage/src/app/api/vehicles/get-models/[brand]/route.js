import { NextResponse } from 'next/server'
import { query } from '@/lib/db';

export async function GET(request, context) {
 
    try {

        const result = await query(
            `SELECT model
            FROM VehicleModel
            WHERE brand = $1
            ORDER BY model ASC`,
            [context.params.brand]
        );

        const models = result.rows.map(model => model.model);
        

        return NextResponse.json({
            brand: context.params.brand,
            models: models,
        }, { status: 200 });
    
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching brand models' }, { status: 500 });
    }
}