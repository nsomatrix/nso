import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Protect /profile
  if (pathname.startsWith("/profile")) {
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and accessing /login, redirect to target or /profile
  if (pathname === "/login") {
    if (sessionCookie) {
      const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/profile";
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = redirectTarget;
      targetUrl.searchParams.delete("redirect");
      return NextResponse.redirect(targetUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login"],
};
