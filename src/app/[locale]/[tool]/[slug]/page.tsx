import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { getTip, getTipsByTool, type Tool } from "@/lib/content";
import { getToolConfig } from "@/lib/tools";
import {
  buildLanguageAlternates,
  ensureLocale,
  getLocalePath,
  getOgLocale,
  siteName,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";
import { MdxContent } from "@/components/mdx-content";
import { ConnectedGuides } from "@/components/connected-guides";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIsoDate } from "@/lib/utils";

const validTools: Tool[] = ["claude-code", "gpt-codex", "gemini-cli"];

export async function generateStaticParams() {
  const params: { tool: string; slug: string }[] = [];
  for (const tool of validTools) {
    // Read from 'en' as the canonical source
    const tips = getTipsByTool("en", tool);
    for (const tip of tips) {
      params.push({ tool, slug: tip.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, tool, slug } = await params;

  if (!hasLocale(locales, locale) || !validTools.includes(tool as Tool)) {
    return {};
  }

  const safeLocale = ensureLocale(locale);
  const typedTool = tool as Tool;
  const tip = getTip(safeLocale, typedTool, slug);

  if (!tip) {
    notFound();
  }

  const toolConfig = getToolConfig(typedTool);
  const pagePath = `/${typedTool}/${slug}`;
  const localePath = getLocalePath(safeLocale, pagePath);
  const title = tip.title;
  const description = tip.description;

  return {
    title,
    description,
    keywords: tip.tags,
    alternates: {
      canonical: toAbsoluteUrl(localePath),
      languages: buildLanguageAlternates(pagePath),
    },
    openGraph: {
      type: "article",
      siteName,
      title,
      description,
      url: toAbsoluteUrl(localePath),
      locale: getOgLocale(safeLocale),
      publishedTime: tip.date,
      modifiedTime: tip.date,
      section: toolConfig.name,
      tags: tip.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function TipPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string; slug: string }>;
}) {
  const { locale, tool, slug } = await params;
  setRequestLocale(locale);

  if (!validTools.includes(tool as Tool)) {
    notFound();
  }

  const tip = getTip(locale, tool as Tool, slug);
  if (!tip) {
    notFound();
  }

  const t = await getTranslations();
  const toolConfig = getToolConfig(tool as Tool);
  const safeLocale = ensureLocale(locale);
  const canonicalUrl = toAbsoluteUrl(getLocalePath(safeLocale, `/${tool}/${slug}`));
  const formattedDate = formatIsoDate(tip.date, locale);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tip.title,
    description: tip.description,
    inLanguage: safeLocale,
    datePublished: tip.date,
    dateModified: tip.date,
    keywords: tip.tags.join(", "),
    articleSection: toolConfig.name,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: "Sangyi Baek",
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Back link */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-8 -ml-2 text-muted-foreground"
      >
        <Link href={`/${locale}/${tool}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-1"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t("tip.backToList", { tool: toolConfig.name })}
        </Link>
      </Button>

      {/* Article header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <span
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${toolConfig.gradient} flex items-center justify-center text-sm font-bold ${toolConfig.color}`}
            aria-hidden="true"
          >
            {toolConfig.icon}
          </span>
          <span className="text-sm text-muted-foreground">{toolConfig.name}</span>
          <span className="text-muted-foreground/30" aria-hidden="true">
            ·
          </span>
          <Badge
            variant="outline"
            className={difficultyColors[tip.difficulty]}
          >
            {t(`tip.difficulty.${tip.difficulty}`)}
          </Badge>
          <span className="text-muted-foreground/30" aria-hidden="true">
            ·
          </span>
          <span className="text-sm text-muted-foreground font-mono">
            {t("tip.readingTime", { minutes: tip.readingTime })}
          </span>
          <span className="text-muted-foreground/30" aria-hidden="true">
            ·
          </span>
          <time
            dateTime={tip.date}
            className="text-sm text-muted-foreground"
          >
            {t("tip.updatedOn", { date: formattedDate })}
          </time>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {tip.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {tip.description}
        </p>

        {tip.tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap" aria-label="Tags">
            {tip.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article content */}
      <article>
        <MdxContent content={tip.content} />
      </article>

      {/* Connected guides */}
      {tip.connections.length > 0 && (
        <ConnectedGuides
          connections={tip.connections}
          locale={locale}
          title={t("tip.connections.title")}
        />
      )}
    </div>
  );
}
