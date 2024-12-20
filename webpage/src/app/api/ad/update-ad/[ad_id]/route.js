import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request, context) {
  const adID = context.params.ad_id;

  const {title, price, brand, model, year, km, gear_type, fuel_type, description} = await request.json();

  console.log("model:", model)

  return "1"
  // Authentication check (if needed)
  const authCookie = request.cookies.get('Authorization')?.value;
  const token = getAuthToken(authCookie);

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // The body should contain the updated fields, e.g.:
  // {
  //   "title": "New Title",
  //   "price": "10000",
  //   "brand": "BrandName",
  //   "model": "ModelName",
  //   "year": "2022",
  //   "km": "5000",
  //   "gear_type": "automatic",
  //   "fuel_type": "gasoline",
  //   "description": "Updated description"
  // }

  try {
    const updatedAd = await updateAdInDB(adID, body);
    if (!updatedAd) {
      return NextResponse.json({ error: 'Ad not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedAd, { status: 200 });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}