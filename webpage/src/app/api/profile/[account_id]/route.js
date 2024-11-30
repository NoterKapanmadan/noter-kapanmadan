import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const account_id = context.params.account_id;

  if (!account_id) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  try {
    const user = await query(
      `SELECT forename, surname, email, phone_number, registration_date, description, profile_image
        FROM Users
        JOIN Account ON Account.account_ID = Users.account_ID
        WHERE Users.account_ID = $1`,
      [account_id]
    );

    if (user.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.rows[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
