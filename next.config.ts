import type { NextConfig } from "next";

const allowedOrigins = [
  "localhost:3000",
  "kumarie.in",
  "www.kumarie.in",
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "",
].filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "burst.shopifycdn.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Treat /public/images/** as local (no remote pattern needed)
    // unoptimized: false (default) — Next.js optimizes local images
  },
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
