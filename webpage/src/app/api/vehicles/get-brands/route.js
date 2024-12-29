import { NextResponse } from 'next/server'
import { query } from '@/lib/db';

export async function GET(request, context) {
    try {


        const result = await query(
            `SELECT brand
             FROM VehicleBrand
             ORDER BY brand ASC`
        );
    

        const brands = result.rows.map(brand => brand.brand);

        return NextResponse.json({
            brands: brands
        }, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error fetching brands' }, { status: 500 });
    }
}