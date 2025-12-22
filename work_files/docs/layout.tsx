import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kollect-It | Curated Antiques & Fine Collectibles",
    template: "%s | Kollect-It",
  },
  description:
    "Discover authenticated antiques, rare books, fine art, and historic militaria. A collector-run marketplace with personally reviewed listings.",
  keywords: [
    "antiques",
    "collectibles",
    "rare books",
    "fine art",
    "militaria",
    "vintage",
    "authenticated",
  ],
  authors: [{ name: "Kollect-It" }],
  creator: "Kollect-It",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://kollect-it.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Kollect-It",
    title: "Kollect-It | Curated Antiques & Fine Collectibles",
    description:
      "Discover authenticated antiques, rare books, fine art, and historic militaria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kollect-It | Curated Antiques & Fine Collectibles",
    description:
      "Discover authenticated antiques, rare books, fine art, and historic militaria.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1A1A1A" />
      </head>
      <body className="min-h-screen bg-lux-cream text-lux-black antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-lux-gold focus:px-4 focus:py-2 focus:text-lux-black"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
