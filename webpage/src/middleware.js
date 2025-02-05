import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/auth";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    // allow all GET endpoints
    if (req.method === "GET") {
      return NextResponse.next();
    }

    const unprotectedRoutes = ["/api/auth/register", "/api/auth/login", "/api/ad/increment-views"];
    const isUnprotectedRoute = unprotectedRoutes.some(
      (route) => route === pathname
    );

    if (isUnprotectedRoute) {
      return NextResponse.next();
    }

    const token = req.cookies.get("Authorization")?.value;
    const payload = await decrypt(token);
    const isAuthenticated = payload?.account_id;

    if (isAuthenticated) {
      return NextResponse.next();
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const cookieStore = await cookies();

  const token = cookieStore.get("Authorization")?.value;
  const payload = await decrypt(token);
  const isAuthenticated = payload?.account_id;

  const adRoutePattern = /^\/ad\/[^/]+$/;
  const profileRoutePattern = /^\/profile\/[^/]+$/;
  const isUnprotectedRoute = adRoutePattern.test(pathname) || profileRoutePattern.test(pathname) || pathname === '/'

  if (isUnprotectedRoute) {
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
