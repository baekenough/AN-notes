import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { locales } from "@/i18n/config";
import { tools } from "@/lib/tools";
import {
  getAllTips,
  getLatestTipsByTool,
  getLearningPathTips,
} from "@/lib/content";
import {
  buildLanguageAlternates,
  ensureLocale,
  getHomeSeoCopy,
  getLocalePath,
  getOgLocale,
  siteName,
  toAbsoluteUrl,
} from "@/lib/seo";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const copy = getHomeSeoCopy(safeLocale);
  const localePath = getLocalePath(safeLocale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: toAbsoluteUrl(localePath),
      languages: buildLanguageAlternates(),
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const allTips = getAllTips(locale);
  const sortedTips = [...allTips].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title)
  );
  const isKorean = locale === "ko";
  const featuredTips = sortedTips.filter(tip => tip.featured);
  const starterTip =
    sortedTips.find(tip => tip.slug.includes("getting-started")) ??
    featuredTips.find(tip => tip.difficulty === "beginner") ??
    sortedTips.find(tip => tip.difficulty === "beginner") ??
    sortedTips[0] ??
    null;
  const activeToolPaths = tools
    .filter(tool => tool.status === "active")
    .map(tool => ({
      tool,
      tips: getLearningPathTips(locale, tool.id, 3),
    }))
    .filter(entry => entry.tips.length > 0);
  const latestTips = tools
    .filter(tool => tool.status === "active")
    .map(tool => ({
      tool,
      tip: getLatestTipsByTool(locale, tool.id, 1)[0] ?? null,
    }))
    .filter(entry => entry.tip !== null) as {
    tool: (typeof tools)[number];
    tip: NonNullable<ReturnType<typeof getLatestTipsByTool>[number]>; // TipMeta
  }[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />

        <div className="container mx-auto max-w-5xl px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-sm">
              {t("site.subtitle")}
            </Badge>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t("hero.title")}{" "}
              <span
                className={`inline-block ${
                  isKorean
                    ? "break-keep whitespace-nowrap tracking-normal text-orange-300"
                    : "bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent"
                }`}
              >
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitleLine1")}
              <br />
              {t("hero.subtitleLine2")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="min-w-36">
                <Link href="#tools">{t("hero.browseTips")}</Link>
              </Button>
              {starterTip && (
                <Button asChild size="lg" variant="outline" className="min-w-36">
                  <Link href={`/${locale}/${starterTip.tool}/${starterTip.slug}`}>
                    {t("hero.getStarted")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      {activeToolPaths.length > 0 && (
        <section className="py-16 border-t border-border/40">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("learningPath.sectionTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("learningPath.sectionDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {activeToolPaths.map(({ tool, tips }) => {
                const [starter, ...rest] = tips;

                return (
                  <Card key={tool.id} className="h-full">
                    <CardContent className="p-6 flex h-full flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <span
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-base font-bold ${tool.color}`}
                          aria-hidden="true"
                        >
                          {tool.icon}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {tool.vendor}
                          </p>
                        </div>
                      </div>

                      {starter && (
                        <div className="mb-5">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                            {t("learningPath.startHere")}
                          </p>
                          <Link
                            href={`/${locale}/${starter.tool}/${starter.slug}`}
                            className="group block rounded-lg border border-border/60 p-4 hover:border-primary/30 transition-colors"
                          >
                            <p className="font-medium leading-snug group-hover:text-primary transition-colors">
                              {starter.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                              {starter.description}
                            </p>
                          </Link>
                        </div>
                      )}

                      {rest.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                            {t("learningPath.nextSteps")}
                          </p>
                          <ol className="space-y-2">
                            {rest.map((tip, index) => (
                              <li key={tip.slug} className="text-sm">
                                <Link
                                  href={`/${locale}/${tip.tool}/${tip.slug}`}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <span className="mr-2 text-xs text-muted-foreground/70">
                                    {index + 2}.
                                  </span>
                                  {tip.title}
                                </Link>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="mt-auto">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/${locale}/${tool.id}`}>
                            {t("learningPath.viewToolGuides", {
                              tool: tool.name,
                            })}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tools Section */}
      <section id="tools" className="py-16 border-t border-border/40 scroll-mt-24">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            {t("tools.sectionTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map(tool => {
              const tipCount =
                tool.status === "active"
                  ? allTips.filter(tip => tip.tool === tool.id).length
                  : 0;

              return (
                <Link
                  key={tool.id}
                  href={
                    tool.status === "active" ? `/${locale}/${tool.id}` : "#"
                  }
                  className={
                    tool.status === "coming-soon" ? "pointer-events-none" : ""
                  }
                >
                  <Card
                    className={`group h-full transition-all duration-200 ${
                      tool.status === "active"
                        ? "hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                        : "opacity-50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-lg font-bold ${tool.color}`}
                        >
                          {tool.icon}
                        </span>
                        {tool.status === "coming-soon" ? (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground/50 border-muted-foreground/20"
                          >
                            {t("tools.comingSoon")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {t("tools.tips", { count: tipCount })}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tool.vendor}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      {latestTips.length > 0 && (
        <section className="py-16 border-t border-border/40">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("latestUpdates.sectionTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("latestUpdates.sectionDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {latestTips.map(({ tool, tip }) => (
                <div key={`${tool.id}-${tip.slug}-latest`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-xs font-bold ${tool.color}`}
                      aria-hidden="true"
                    >
                      {tool.icon}
                    </span>
                    <p className="text-sm font-medium">{tool.name}</p>
                  </div>
                  <TipCard
                    tip={tip}
                    locale={locale}
                    difficultyLabels={{
                      beginner: t("tip.difficulty.beginner"),
                      intermediate: t("tip.difficulty.intermediate"),
                      advanced: t("tip.difficulty.advanced"),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Tips */}
      {featuredTips.length > 0 && (
        <section
          id="featured"
          className="py-16 border-t border-border/40 scroll-mt-24"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("common.featured")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredTips.map(tip => (
                <TipCard
                  key={`${tip.tool}-${tip.slug}`}
                  tip={tip}
                  locale={locale}
                  difficultyLabels={{
                    beginner: t("tip.difficulty.beginner"),
                    intermediate: t("tip.difficulty.intermediate"),
                    advanced: t("tip.difficulty.advanced"),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
