import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { hashWithSalt } from '@/lib/auth';

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const email = formData.get("email").toLowerCase();
    const user = await query(
      `SELECT * 
      FROM Account 
      WHERE email = $1 
      LIMIT 1;`,
      [email]);

    if (user.rowCount > 0) {
      return NextResponse.json({ error: 'Email already exists!' }, { status: 403 })
    }

    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match!' }, { status: 403 })
    }

    const hashedPassword = hashWithSalt(password, process.env.PASSWORD_SALT)
    const newAccountID = uuidv4();
    const forename = formData.get("forename");
    const surname = formData.get("surname");
    const phoneNumber = formData.get("phone_number");

    await query('BEGIN')

    await query(
      `INSERT INTO Account (account_id, forename, surname, email, hashed_password, phone_number) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;`,
      [newAccountID, forename, surname, email, hashedPassword, phoneNumber]);
    
    await query(
      `INSERT INTO Users (account_id, profile_image, description) 
      VALUES ($1, $2, $3) 
      RETURNING *;`,
      [newAccountID, null, null]);

    const queryResponse = await query('COMMIT');

    if (queryResponse.rowCount == 0) {
      return NextResponse.json({ error: 'Account cannot be created!' }, { status: 403 })
    }
    
    return NextResponse.json({ msg: 'Account is created successfully!' }, { status: 200 })
  } catch (err) {
    console.log(err);
    query('ROLLBACK');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}