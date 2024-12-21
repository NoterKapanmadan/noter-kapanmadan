import { jwtVerify } from "jose";

const JWTSecret = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(JWTSecret);

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
