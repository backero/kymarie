import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kumarie — Handcrafted Natural Soaps",
    template: "%s | Kumarie",
  },
  description:
    "Artisanal handcrafted soaps made with pure botanicals, cold-pressed oils, and ancient herbal wisdom. Indulge your skin in nature's finest.",
  keywords: [
    "handmade soap",
    "natural soap",
    "artisanal soap",
    "herbal soap",
    "organic soap",
    "kumarie",
    "ayurvedic soap",
    "cold process soap",
  ],
  authors: [{ name: "Kumarie" }],
  creator: "Kumarie",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Kumarie",
    title: "Kumarie — Handcrafted Natural Soaps",
    description:
      "Artisanal handcrafted soaps made with pure botanicals and ancient herbal wisdom.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Kumarie Natural Soaps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumarie — Handcrafted Natural Soaps",
    description: "Artisanal soaps made with pure botanicals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "font-body text-sm",
              style: {
                background: "#FFFFFF",
                color: "#1A1A18",
                border: "1px solid #E8E8E6",
                borderRadius: "10px",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
              },
              success: {
                iconTheme: {
                  primary: "#3D6B5C",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
