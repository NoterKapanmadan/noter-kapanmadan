import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

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

export async function POST(req, context) {
  try {
    const { account_id } = await decrypt(
      req.cookies.get("Authorization").value
    );
    const formData = await req.formData();

    const forename = formData.get("forename");
    const surname = formData.get("surname");
    const email = formData.get("email").toLowerCase();
    const phone_number = formData.get("phone_number");
    const description = formData.get("description");

    await query("BEGIN");

    await query(
      `UPDATE Account
      SET forename = $1, surname = $2, email = $3, phone_number = $4
      WHERE account_id = $5`,
      [forename, surname, email, phone_number, account_id]
    );

    await query(
      `UPDATE Users
      SET description = $1
      WHERE account_id = $2`,
      [description, account_id]
    );

    await query("COMMIT");

    if (user.rowCount > 0) {
      return NextResponse.json(
        { error: "Email already exists!" },
        { status: 403 }
      );
    }
  } catch (err) {
    console.log(err);
    query("ROLLBACK");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
