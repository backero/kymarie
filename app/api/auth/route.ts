import { NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";

// GET /api/auth - Check auth status
export async function GET() {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  });
}
