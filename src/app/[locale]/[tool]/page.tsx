import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { getLatestTipsByTool, getTipsByTool, type Tool } from "@/lib/content";
import { getToolConfig } from "@/lib/tools";
import {
  buildLanguageAlternates,
  ensureLocale,
  getLocalePath,
  getOgLocale,
  getToolSeoCopy,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const validTools: Tool[] = ["claude-code", "gpt-codex", "gemini-cli"];

export function generateStaticParams() {
  return validTools.map(tool => ({ tool }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool } = await params;

  if (!hasLocale(locales, locale) || !validTools.includes(tool as Tool)) {
    return {};
  }

  const safeLocale = ensureLocale(locale);
  const typedTool = tool as Tool;
  const tipCount =
    getTipsByTool(safeLocale, typedTool).length ||
    getTipsByTool("en", typedTool).length;
  const { title, description } = getToolSeoCopy(
    safeLocale,
    typedTool,
    tipCount,
  );
  const toolPath = `/${typedTool}`;
  const localePath = getLocalePath(safeLocale, toolPath);

  return {
    title,
    description,
    alternates: {
      canonical: toAbsoluteUrl(localePath),
      languages: buildLanguageAlternates(toolPath),
    },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: toAbsoluteUrl(localePath),
      locale: getOgLocale(safeLocale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { locale, tool } = await params;
  setRequestLocale(locale);

  if (!validTools.includes(tool as Tool)) {
    notFound();
  }

  const toolConfig = getToolConfig(tool as Tool);

  if (toolConfig.status === "coming-soon") {
    const t = await getTranslations();
    return (
      <div className="container mx-auto max-w-5xl px-4 py-24 text-center">
        <span
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${toolConfig.gradient} flex items-center justify-center text-3xl font-bold ${toolConfig.color} mx-auto mb-6`}
        >
          {toolConfig.icon}
        </span>
        <h1 className="text-3xl font-bold mb-4">{toolConfig.name}</h1>
        <p className="text-muted-foreground text-lg">{t("tools.comingSoon")}</p>
      </div>
    );
  }

  const t = await getTranslations();
  const tips = getTipsByTool(locale, tool as Tool);
  const orderedTips = [...tips].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title)
  );
  const [starterTip, ...remainingTips] = orderedTips;
  const nextTips = remainingTips.slice(0, 3);
  const recentTips = getLatestTipsByTool(locale, tool as Tool, 3);

  const beginnerTips = tips.filter(tip => tip.difficulty === "beginner");
  const intermediateTips = tips.filter(
    tip => tip.difficulty === "intermediate"
  );
  const advancedTips = tips.filter(tip => tip.difficulty === "advanced");

  const difficultyLabels = {
    beginner: t("tip.difficulty.beginner"),
    intermediate: t("tip.difficulty.intermediate"),
    advanced: t("tip.difficulty.advanced"),
  };

  const sections = [
    { tips: beginnerTips, label: difficultyLabels.beginner },
    { tips: intermediateTips, label: difficultyLabels.intermediate },
    { tips: advancedTips, label: difficultyLabels.advanced },
  ].filter(s => s.tips.length > 0);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Tool header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <span
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${toolConfig.gradient} flex items-center justify-center text-xl sm:text-2xl font-bold ${toolConfig.color} flex-shrink-0`}
          >
            {toolConfig.icon}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{toolConfig.name}</h1>
            <p className="text-muted-foreground truncate">{toolConfig.vendor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="outline">
            {t("tools.tips", { count: tips.length })}
          </Badge>
          <a
            href={toolConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            aria-label={`${toolConfig.name} documentation (opens in new tab)`}
          >
            Docs
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>

      {starterTip && (
        <Card className="mb-12 border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <CardContent className="p-6 md:p-7">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  {t("learningPath.toolTitle")}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">
                  {t("learningPath.startHere")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  {t("learningPath.toolDescription", { tool: toolConfig.name })}
                </p>
                <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    1. {t("learningPath.firstGuide")}
                  </p>
                  <Link
                    href={`/${locale}/${starterTip.tool}/${starterTip.slug}`}
                    className="block group"
                  >
                    <p className="font-semibold leading-snug group-hover:text-primary transition-colors">
                      {starterTip.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {starterTip.description}
                    </p>
                  </Link>
                </div>
                <div className="mt-5">
                  <Button asChild>
                    <Link href={`/${locale}/${starterTip.tool}/${starterTip.slug}`}>
                      {t("learningPath.openFirstGuide")}
                    </Link>
                  </Button>
                </div>
              </div>

              {nextTips.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                    {t("learningPath.nextSteps")}
                  </p>
                  <div className="space-y-3">
                    {nextTips.map((tip, index) => (
                      <Link
                        key={tip.slug}
                        href={`/${locale}/${tip.tool}/${tip.slug}`}
                        className="block rounded-xl border border-border/60 p-4 hover:border-primary/30 transition-colors"
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          {index + 2}. {t("learningPath.step")}
                        </p>
                        <p className="font-medium leading-snug">{tip.title}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {tip.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {recentTips.length > 0 && (
        <div className="mb-12">
          <div className="mb-5 max-w-2xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {t("latestUpdates.toolTitle", { tool: toolConfig.name })}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("latestUpdates.toolDescription", { tool: toolConfig.name })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentTips.map(tip => (
              <TipCard
                key={`${tip.slug}-recent`}
                tip={tip}
                locale={locale}
                difficultyLabels={difficultyLabels}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips by difficulty */}
      {sections.map((section, idx) => (
        <div key={section.label} className={idx > 0 ? "mt-12" : ""}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {section.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.tips.map(tip => (
              <TipCard
                key={tip.slug}
                tip={tip}
                locale={locale}
                difficultyLabels={difficultyLabels}
              />
            ))}
          </div>
          {idx < sections.length - 1 && <Separator className="mt-12" />}
        </div>
      ))}
    </div>
  );
}
