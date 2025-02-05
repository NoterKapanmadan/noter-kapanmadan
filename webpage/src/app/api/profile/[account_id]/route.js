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
      `SELECT * FROM user_profile_view WHERE account_ID = $1`,
      [account_id]
    );

    if (user.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const imageId = user.rows[0].profile_image;
    const imageSrc = getImageSrc(imageId);

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

    await query("BEGIN");

    await query(
      `UPDATE Account
      SET forename = $1, surname = $2, phone_number = $3
      WHERE account_id = $4`,
      [forename, surname, phone_number, account_id]
    );

    await query(
      `UPDATE Users
       SET description = $1
       WHERE account_id = $2`,
      [description, account_id]
    );

    if (profilePicture) {
      const profilePictureArr = [profilePicture];
      const { imageIds } = await uploadFilesServer(profilePictureArr);
      const imageId = imageIds[0];

      await query(
        `UPDATE Users
         SET profile_image = $1
         WHERE account_id = $2`,
        [imageId, account_id]
      );
    }

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
