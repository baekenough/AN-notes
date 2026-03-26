import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  buildLanguageAlternates,
  ensureLocale,
  getLocaleDescription,
  getLocalePath,
  getOgLocale,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";

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
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
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
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
