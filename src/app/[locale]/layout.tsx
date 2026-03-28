import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  buildLanguageAlternates,
  ensureLocale,
  getDefaultOpenGraphImageUrl,
  getDefaultTwitterImageUrl,
  getLocaleDescription,
  getLocalePath,
  getOgLocale,
  getSiteKeywords,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    return {};
  }

  const safeLocale = ensureLocale(locale);
  const localePath = getLocalePath(safeLocale);
  const description = getLocaleDescription(safeLocale);

  return {
    description,
    keywords: getSiteKeywords(safeLocale),
    alternates: {
      canonical: toAbsoluteUrl(localePath),
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      url: toAbsoluteUrl(localePath),
      locale: getOgLocale(safeLocale),
      images: [getDefaultOpenGraphImageUrl()],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [getDefaultTwitterImageUrl()],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        lang={locale}
        className={`flex min-h-screen flex-col ${
          locale === "ko" ? notoSansKr.className : ""
        }`}
      >
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
