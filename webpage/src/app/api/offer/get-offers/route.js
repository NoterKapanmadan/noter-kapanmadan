import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { getImageSrc } from '@/utils/file';

export async function GET(request) {
  try{
    const { account_id } = await decrypt(request.cookies.get("Authorization").value)

    const incomingOffersQuery = `
      SELECT b.*, a.title, a.price, acc.account_ID as bidder_id, acc.email AS bidder_email, acc.forename AS bidder_forename, acc.surname AS bidder_surname, u.profile_image AS profile_image
      FROM Bid b
      JOIN Ad a ON b.ad_ID = a.ad_ID
      JOIN Account acc ON b.user_ID = acc.account_ID
      JOIN Users u ON u.account_ID = acc.account_ID
      WHERE a.user_ID = $1
      ORDER BY b.date DESC;
    `;

    const sentOffersQuery = `
      SELECT b.*, a.title, a.price, acc.account_ID as owner_id, a.location, acc.email AS owner_email, acc.forename AS owner_forename, acc.surname AS owner_surname, u.profile_image AS profile_image
      FROM Bid b
      JOIN Ad a ON b.ad_ID = a.ad_ID
      JOIN Account acc ON a.user_ID = acc.account_ID
      JOIN Users u ON u.account_ID = acc.account_ID
      WHERE b.user_ID = $1
      ORDER BY b.date DESC;
    `;
    
    const incomingOffersResult = await query(incomingOffersQuery, [account_id]);
    const sentOffersResult = await query(sentOffersQuery, [account_id]);
    
    const incomingOffers = await Promise.all(
      incomingOffersResult.rows.map(async (offer) => {
        const imageSrc = offer.profile_image ? getImageSrc(offer.profile_image, 'low') : null;
        return {
          ...offer,
          bidder_profile_photo: imageSrc
        };
      })
    );

    const sentOffers = await Promise.all(
      sentOffersResult.rows.map(async (offer) => {
        const imageSrc = offer.profile_image ? getImageSrc(offer.profile_image, 'low') : null;
        return {
          ...offer,
          owner_profile_photo: imageSrc
        };
      })
    );

    const offers = {
      incomingOffers,
      sentOffers
    }

    return NextResponse.json(offers, { status: 200 })
  } 
  catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}