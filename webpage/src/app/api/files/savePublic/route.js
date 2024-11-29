import { NextResponse } from 'next/server'
import { FILE_SERVER_URL, JWT_SECRET } from '@/utils/constants';

export async function POST(request) {
    try {
        console.log("request.body", request.body);
        const body = await request.json();
        const jwt = body.jwt;
        const response = await fetch(`${FILE_SERVER_URL}/serverStorage/saveRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authentication': JWT_SECRET
            },
            body: JSON.stringify({ jwt: jwt }),
            cache: 'no-cache',
        });
        if (!response.ok) {
            return NextResponse.json('Failed to request token', { status: 500 });
        }
        const data = await response.json();

        console.log("save data: ", data);

        return NextResponse.json({path: data.path}, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

