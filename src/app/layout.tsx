/*
 * F001 PRE-IMPLEMENTATION THINKING:
 * 1. What: Root layout with mobile-first viewport, camera-ready meta tags, PWA support.
 * 2. Decisions: Dark theme by default (fear-driven UX works better on dark bg),
 *    viewport-fit=cover for notched phones, standalone PWA display mode.
 * 3. Risks: iOS Safari quirks with viewport-fit, PWA install prompt timing.
 * 4. Simplest: Standard Next.js layout with proper meta tags and manifest link.
 * 5. Tests: Build succeeds, meta tags render correctly.
 */

import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: "ToxicPaw - Pet Food Ingredient Scanner",
  description:
    "Scan pet food labels instantly. AI-powered ingredient analysis gives your pet's food a safety grade from A to F.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ToxicPaw",
  },
  openGraph: {
    title: "ToxicPaw - Pet Food Ingredient Scanner",
    description:
      "Scan pet food labels instantly. AI-powered ingredient analysis gives your pet's food a safety grade from A to F.",
    siteName: "ToxicPaw",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToxicPaw - Pet Food Ingredient Scanner",
    description:
      "Scan pet food labels instantly. AI-powered ingredient analysis gives your pet's food a safety grade from A to F.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <I18nProvider>
          <LanguageSwitcher />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
