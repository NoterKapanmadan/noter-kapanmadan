import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { decrypt } from "./lib/auth";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieStore = await cookies();

  const token = cookieStore.get('Authorization')?.value
  const payload = await decrypt(token)
  const isAuthenticated = payload?.account_id

  const authRoutes = ["/login", "/register"]

  const isAuthRoute = authRoutes.some(route => route === pathname)

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
