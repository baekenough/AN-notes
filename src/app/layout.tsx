import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultLocale } from "@/i18n/config";
import {
  getDefaultOpenGraphImageUrl,
  getDefaultTwitterImageUrl,
  getSiteKeywords,
  siteAuthorName,
  siteName,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultDescription =
  "Human-written guides for Claude Code, GPT Codex, and Gemini CLI covering setup, instructions, sandboxing, MCP, automation, and multi-agent workflows.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  authors: [{ name: siteAuthorName }],
  creator: siteAuthorName,
  publisher: siteName,
  category: "Developer education",
  keywords: getSiteKeywords(defaultLocale),
  alternates: {
    canonical: `/${defaultLocale}`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: defaultDescription,
    url: `/${defaultLocale}`,
    images: [getDefaultOpenGraphImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
    images: [getDefaultTwitterImageUrl()],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
