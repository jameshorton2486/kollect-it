import type { Metadata } from "next";
import { Lato, Cormorant_Garamond, Archivo_Black } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { SessionProvider } from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kollect-It – Collectibles Worth Collecting",
    template: "%s – Kollect-It",
  },
  description:
    "Professionally described, fairly priced, personally curated. Rare books, fine art, collectibles, and militaria from $500-$15,000.",
  metadataBase: new URL("https://kollect-it.com"),
  openGraph: {
    type: "website",
    siteName: "Kollect-It",
    title: "Kollect-It – Collectibles Worth Collecting",
    description:
      "Professionally described, fairly priced, personally curated. Items from $500-$15,000 that deserve expert attention.",
    url: "https://kollect-it.com",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kollect-It marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kollect_it",
    creator: "@kollect_it",
    title: "Kollect-It – Curated Antiques & Collectibles",
    description:
      "Explore authenticated fine art, rare books, collectibles, and militaria with trusted provenance.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${cormorant.variable} ${archivoBlack.variable}`}
    >
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />

        {/* GA4 Analytics - Initialize with environment variable */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-[hsl(var(--surface-50))] text-[hsl(var(--ink-900))]"
      >
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-surface-0 focus:text-ink focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <ClientBody>
                <div id="main">{children}</div>
              </ClientBody>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

