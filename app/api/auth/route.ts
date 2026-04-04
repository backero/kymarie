import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/auth - Check auth status (admin)
export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });
}
