import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { hashWithSalt, encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const email = formData.get("email").toLowerCase();
    const password = formData.get("password");
    const hashedPassword = hashWithSalt(password, process.env.PASSWORD_SALT);
 
    const user = await query(
      `SELECT account_id
      FROM Account 
      WHERE email = $1 and hashed_password = $2
      LIMIT 1;`,
      [email, hashedPassword]);

    if (user.rowCount > 0) {
      const admin = await query(
        `SELECT account_id
        FROM Admin
        WHERE account_id = $1
        LIMIT 1;`,
        [user.rows[0].account_id]);
      user.rows[0].isAdmin = admin.rowCount > 0;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const token = await encrypt(user.rows[0])

      const cookieStore = await cookies()
      cookieStore.set(
        'Authorization',
        token,
        {
          httpOnly: true,
          secure: true,
          expires: expiresAt,
          sameSite: 'lax',
          path: '/',
        }
      )

      return NextResponse.json({ msg: 'Login successful!' }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Wrong credentials!' }, { status: 403 })
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}