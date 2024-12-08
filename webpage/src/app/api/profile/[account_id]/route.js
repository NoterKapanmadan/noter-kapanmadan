import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { uploadFilesServer, getImageSrc } from "@/utils/file";

export async function GET(req, context) {
  const account_id = context.params.account_id;

  if (!account_id) {
    return res.status(400).json({ error: "Account ID is required" });
  }

  try {
    const user = await query(
      `SELECT Account.account_id, forename, surname, email, phone_number, registration_date, description, profile_image
        FROM Users
        JOIN Account ON Account.account_ID = Users.account_ID
        WHERE Users.account_ID = $1`,
      [account_id]
    );

    if (user.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const imageId = user.rows[0].profile_image;
    const imageSrc = await getImageSrc(imageId);

    const userData = {
      ...user.rows[0],
      profilePicture: imageId && imageSrc,
    };

    return NextResponse.json(userData, { status: 200 });
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
    const phone_number = formData.get("phone_number");
    const description = formData.get("description");
    const profilePicture = formData.get("profilePicture");

    const profilePictureArr = [profilePicture];

    const { imageIds } = await uploadFilesServer(profilePictureArr);
    const imageId = imageIds[0];

    await query("BEGIN");

    await query(
      `UPDATE Account
      SET forename = $1, surname = $2, phone_number = $3
      WHERE account_id = $4`,
      [forename, surname, phone_number, account_id]
    );

    await query(
      `UPDATE Users
      SET description = $1, profile_image = $3
      WHERE account_id = $2`,
      [description, account_id, imageId]
    );

    await query("COMMIT");

    return NextResponse.json(
      { msg: "Profile is updated successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    query("ROLLBACK");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
