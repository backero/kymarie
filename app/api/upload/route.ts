import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const DEMO_MODE = !process.env.CLOUDINARY_API_KEY ||
                  process.env.CLOUDINARY_API_KEY === "your-api-key";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const contentType = req.headers.get("content-type") || "";

    // ── URL mode (demo / no Cloudinary) ─────────────────────────────
    if (contentType.includes("application/json")) {
      const { urls } = await req.json();
      if (!Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ success: false, error: "No URLs provided" }, { status: 400 });
      }
      // Basic URL validation
      for (const url of urls) {
        try { new URL(url); } catch {
          return NextResponse.json({ success: false, error: `Invalid URL: ${url}` }, { status: 400 });
        }
      }
      return NextResponse.json({ success: true, urls });
    }

    // ── File upload mode (Cloudinary) ────────────────────────────────
    if (DEMO_MODE) {
      return NextResponse.json(
        { success: false, error: "File upload requires Cloudinary credentials. Use URL mode instead." },
        { status: 400 }
      );
    }

    const { uploadImage } = await import("@/lib/cloudinary");
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: `Invalid file type: ${file.type}` }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ success: false, error: `File too large: ${file.name}` }, { status: 400 });
      }
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadImage(buffer, "kumarie/products");
      })
    );

    return NextResponse.json({ success: true, urls: results.map((r) => r.url) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
