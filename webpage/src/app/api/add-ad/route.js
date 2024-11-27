import { NextResponse } from 'next/server'
import { query } from '@/lib/db';

export async function POST(request) {
    try {
        const formData = await request.formData()
        console.log(formData)
        return NextResponse.json({ msg: 'Ad added!' }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}