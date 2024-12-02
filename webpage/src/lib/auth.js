import "server-only";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export function hashWithSalt(str, salt) {
  return crypto.pbkdf2Sync(str, salt, 100000, 64, "sha256").toString("hex");
}

const JWTSecret = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(JWTSecret);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify token");
  }
}

export async function createSession(payload) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const token = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set("Authorization", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export function getAuthToken() {
  return cookies().get("Authorization")?.value;
}
