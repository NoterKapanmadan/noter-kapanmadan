import { NextResponse } from 'next/server'
import { IMAGE_SERVER_URL, JWT_SECRET } from '@/utils/constants';

export async function GET(request) {
    try {
        const response = await fetch(`${IMAGE_SERVER_URL}/serverStorage/createRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authentication': JWT_SECRET
            },
            cache: 'no-cache',
        });
        if (!response.ok) {
            return NextResponse.json('Failed to request token', { status: 500 });
        }
        const data = await response.json();
        return NextResponse.json({jwt: data.jwt}, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

