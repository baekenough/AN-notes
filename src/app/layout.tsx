import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultLocale } from "@/i18n/config";
import { siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Master your AI coding tools the right way",
  alternates: {
    canonical: `/${defaultLocale}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: "Master your AI coding tools the right way",
    url: `/${defaultLocale}`,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Master your AI coding tools the right way",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
