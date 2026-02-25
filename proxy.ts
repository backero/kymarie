import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/products",
  "/admin/orders",
  "/admin/settings",
  "/admin/categories",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route (but not the login page)
  const isAdminRoute =
    ADMIN_PATHS.some((path) => pathname.startsWith(path)) &&
    !pathname.startsWith("/admin/login");

  if (isAdminRoute) {
    const token = request.cookies.get("kumarie_admin_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
