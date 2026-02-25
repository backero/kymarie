import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="grain-overlay antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "font-body text-sm",
            style: {
              background: "#FAF8F3",
              color: "#2D4A1E",
              border: "1px solid #D4C8B0",
              borderRadius: "4px",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)",
            },
            success: {
              iconTheme: {
                primary: "#2D4A1E",
                secondary: "#FAF8F3",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
