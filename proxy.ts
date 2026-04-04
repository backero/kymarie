import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Next.js 16 uses proxy.ts instead of middleware.ts.
// NextAuth v5's auth() wraps the proxy and injects request.auth with the session.
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  // Protect admin routes (except login)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    if (!session || session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect profile routes — require user session
  if (pathname.startsWith("/profile")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/((?!login$).*)",
    "/profile(.*)",
  ],
};
