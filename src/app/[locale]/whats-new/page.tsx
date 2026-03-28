import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { locales } from "@/i18n/config";
import { getLatestTipsByTool } from "@/lib/content";
import { getToolConfig } from "@/lib/tools";
import type { Tool } from "@/lib/content";
import {
  buildLanguageAlternates,
  ensureLocale,
  getLocalePath,
  getOgLocale,
  getWhatsNewSeoCopy,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";

const tagStyles: Record<string, string> = {
  // English
  "GAME CHANGER": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "MIND-BLOWING": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "REVOLUTIONARY": "bg-red-500/10 text-red-400 border-red-500/20",
  "MASSIVE": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "POWERFUL": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "SAFE": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "EFFICIENT": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  // Korean
  "혁신": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "혁명적": "bg-red-500/10 text-red-400 border-red-500/20",
  "충격적": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "강력": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "강력함": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "실용적": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "안전함": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "생산성": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  // Spanish
  "REVOLUCIONARIO": "bg-red-500/10 text-red-400 border-red-500/20",
  "IMPRESIONANTE": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "CAMBIO TOTAL": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "PODEROSO": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "SEGURO": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "EFICIENTE": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const toolKeys = ["claudeCode", "gptCodex", "geminiCli"] as const;
type ToolKey = typeof toolKeys[number];

const toolIdMap: Record<ToolKey, Tool> = {
  claudeCode: "claude-code",
  gptCodex: "gpt-codex",
  geminiCli: "gemini-cli",
};

const featureIndices = [0, 1, 2] as const;

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
  const copy = getWhatsNewSeoCopy(safeLocale);
  const localePath = getLocalePath(safeLocale, "/whats-new");

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: toAbsoluteUrl(localePath),
      languages: buildLanguageAlternates("/whats-new"),
    },
    openGraph: {
      type: "website",
      siteName,
      title: copy.title,
      description: copy.description,
      url: toAbsoluteUrl(localePath),
      locale: getOgLocale(safeLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function WhatsNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const currentYear = new Date().getUTCFullYear();
  const difficultyLabels = {
    beginner: t("tip.difficulty.beginner"),
    intermediate: t("tip.difficulty.intermediate"),
    advanced: t("tip.difficulty.advanced"),
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12">
        <Badge
          variant="outline"
          className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20"
        >
          {currentYear}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {t("whatsNew.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("whatsNew.subtitle")}</p>
      </div>

      {toolKeys.map((toolKey, idx) => {
        const toolConfig = getToolConfig(toolIdMap[toolKey]);
        const recentTips = getLatestTipsByTool(locale, toolIdMap[toolKey], 2);

        return (
          <div key={toolKey}>
            {idx > 0 && <Separator className="my-12" />}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${toolConfig.gradient} flex items-center justify-center text-lg font-bold ${toolConfig.color}`}
                  aria-hidden="true"
                >
                  {toolConfig.icon}
                </span>
                <h2 className="text-2xl font-bold">
                  {t(`whatsNew.${toolKey}.title`)}
                </h2>
              </div>

              <div className="grid gap-4">
                {featureIndices.map((i) => {
                  const tag = t(`whatsNew.${toolKey}.features.${i}.tag`);
                  const tagStyle =
                    tagStyles[tag] ??
                    "bg-secondary text-secondary-foreground border-secondary";

                  return (
                    <Card
                      key={i}
                      className="group transition-all hover:border-primary/20"
                    >
                      <CardContent className="p-6">
                        <Badge
                          variant="outline"
                          className={`mb-3 text-xs font-bold tracking-wider ${tagStyle}`}
                        >
                          {tag}
                        </Badge>
                        <h3 className="text-lg font-bold mb-2">
                          {t(`whatsNew.${toolKey}.features.${i}.title`)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(`whatsNew.${toolKey}.features.${i}.description`)}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {recentTips.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("whatsNew.recentGuidesTitle")}
                    </h3>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/${locale}/${toolIdMap[toolKey]}`}>
                        {t("learningPath.viewToolGuides", {
                          tool: toolConfig.name,
                        })}
                      </Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentTips.map(tip => (
                      <TipCard
                        key={`${toolKey}-${tip.slug}-whats-new`}
                        tip={tip}
                        locale={locale}
                        difficultyLabels={difficultyLabels}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
