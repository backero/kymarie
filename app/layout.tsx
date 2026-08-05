import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { auth } from "@/auth";
import { getSettings } from "@/actions/settings";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kumarie.in";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "Kumarie",
    title: "Kumarie — Handcrafted Natural Soaps",
    description:
      "Artisanal handcrafted soaps made with pure botanicals and ancient herbal wisdom.",
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kumarie",
  url: appUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${appUrl}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([auth(), getSettings()]);

  const sameAs = [settings.instagramUrl, settings.facebookUrl, settings.twitterUrl].filter(
    (url): url is string => Boolean(url)
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kumarie",
    url: appUrl,
    logo: `${appUrl}/logo.png`,
    description:
      "Artisanal handcrafted soaps made with pure botanicals, cold-pressed oils, and ancient herbal wisdom.",
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
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
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
    </html>
  );
}
