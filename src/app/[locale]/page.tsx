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
  getDefaultOpenGraphImageUrl,
  getDefaultTwitterImageUrl,
  getHomeSeoCopy,
  getLocalePath,
  getOgLocale,
  getSiteKeywords,
  mergeKeywords,
  siteName,
  sitePublisher,
  siteUrl,
  toAbsoluteUrl,
} from "@/lib/seo";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FaqItem = {
  question: string;
  answer: string;
};

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
    keywords: mergeKeywords(getSiteKeywords(safeLocale), [siteName]),
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
      images: [getDefaultOpenGraphImageUrl()],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [getDefaultTwitterImageUrl()],
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

  const safeLocale = ensureLocale(locale);
  const t = await getTranslations();
  const allTips = getAllTips(locale);
  const sortedTips = [...allTips].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title)
  );
  const isKorean = locale === "ko";
  const subtitle = t("site.subtitle");
  const faqItems = t.raw("faq.items") as FaqItem[];
  const featuredTips = sortedTips.filter(tip => tip.featured);
  const starterTip =
    sortedTips.find(tip => tip.slug.includes("getting-started")) ??
    featuredTips.find(tip => tip.difficulty === "beginner") ??
    sortedTips.find(tip => tip.difficulty === "beginner") ??
    sortedTips[0] ??
    null;
  const activeTools = tools.filter(tool => tool.status === "active");
  const activeToolPaths = activeTools
    .map(tool => ({
      tool,
      tips: getLearningPathTips(locale, tool.id, 3),
    }))
    .filter(entry => entry.tips.length > 0);
  const latestTips = activeTools
    .map(tool => ({
      tool,
      tip: getLatestTipsByTool(locale, tool.id, 1)[0] ?? null,
    }))
    .filter(entry => entry.tip !== null) as {
    tool: (typeof tools)[number];
    tip: NonNullable<ReturnType<typeof getLatestTipsByTool>[number]>;
  }[];

  const localeHomeUrl = toAbsoluteUrl(getLocalePath(safeLocale));
  const homeSeoCopy = getHomeSeoCopy(safeLocale);
  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: localeHomeUrl,
      description: homeSeoCopy.description,
      inLanguage: safeLocale,
      publisher: sitePublisher,
    },
    {
      "@context": "https://schema.org",
      ...sitePublisher,
      description: homeSeoCopy.description,
      url: siteUrl,
      knowsAbout: getSiteKeywords(safeLocale),
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: homeSeoCopy.title,
      description: homeSeoCopy.description,
      url: localeHomeUrl,
      inLanguage: safeLocale,
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: activeTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: toAbsoluteUrl(getLocalePath(safeLocale, `/${tool.id}`)),
          description: t(`tools.profiles.${tool.messageKey}.summary`),
        })),
      },
    },
    ...(faqItems.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(item => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      {homeStructuredData.map((item, index) => (
        <script
          key={`home-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />

        <div className="container relative mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            {subtitle ? (
              <Badge variant="outline" className="mb-6 text-sm">
                {subtitle}
              </Badge>
            ) : null}

            <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-4xl md:text-6xl">
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

            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {t("hero.subtitleLine1")}
              <br />
              {t("hero.subtitleLine2")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("learningPath.sectionTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("learningPath.sectionDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {activeToolPaths.map(({ tool, tips }) => {
                const [starter, ...rest] = tips;

                return (
                  <Card key={tool.id} className="h-full">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-5 flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-base font-bold ${tool.color}`}
                          aria-hidden="true"
                        >
                          {tool.icon}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{tool.name}</h3>
                          <p className="truncate text-xs text-muted-foreground">
                            {tool.vendor}
                          </p>
                        </div>
                      </div>

                      {starter && (
                        <div className="mb-5">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t("learningPath.startHere")}
                          </p>
                          <Link
                            href={`/${locale}/${starter.tool}/${starter.slug}`}
                            className="group block rounded-lg border border-border/60 p-4 transition-colors hover:border-primary/30"
                          >
                            <p className="font-medium leading-snug transition-colors group-hover:text-primary">
                              {starter.title}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                              {starter.description}
                            </p>
                          </Link>
                        </div>
                      )}

                      {rest.length > 0 && (
                        <div className="mb-6">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t("learningPath.nextSteps")}
                          </p>
                          <ol className="space-y-2">
                            {rest.map((tip, index) => (
                              <li key={tip.slug} className="text-sm">
                                <Link
                                  href={`/${locale}/${tip.tool}/${tip.slug}`}
                                  className="text-muted-foreground transition-colors hover:text-primary"
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
      <section id="tools" className="scroll-mt-24 border-t border-border/40 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("tools.sectionTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("tools.sectionDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {tools.map(tool => {
              const tipCount =
                tool.status === "active"
                  ? allTips.filter(tip => tip.tool === tool.id).length
                  : 0;
              const summary = t(`tools.profiles.${tool.messageKey}.summary`);
              const focus = t.raw(`tools.profiles.${tool.messageKey}.focus`) as string[];

              return (
                <Link
                  key={tool.id}
                  href={tool.status === "active" ? `/${locale}/${tool.id}` : "#"}
                  className={tool.status === "coming-soon" ? "pointer-events-none" : ""}
                >
                  <Card
                    className={`group h-full transition-all duration-200 ${
                      tool.status === "active"
                        ? "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                        : "opacity-50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-lg font-bold ${tool.color}`}
                        >
                          {tool.icon}
                        </span>
                        {tool.status === "coming-soon" ? (
                          <Badge
                            variant="outline"
                            className="border-muted-foreground/20 text-muted-foreground/50"
                          >
                            {t("tools.comingSoon")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {t("tools.tips", { count: tipCount })}
                          </Badge>
                        )}
                      </div>
                      <h3 className="mb-1 text-lg font-bold">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.vendor}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {summary}
                      </p>
                      {focus.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t("tools.highlightsLabel")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {focus.map(item => (
                              <span
                                key={`${tool.id}-${item}`}
                                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("latestUpdates.sectionTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("latestUpdates.sectionDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {latestTips.map(({ tool, tip }) => (
                <div key={`${tool.id}-${tip.slug}-latest`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient} text-xs font-bold ${tool.color}`}
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
          className="scroll-mt-24 border-t border-border/40 py-16"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("common.featured")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 max-w-2xl">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("faq.sectionTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("faq.sectionDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {faqItems.map(item => (
                <Card key={item.question} className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold tracking-tight">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
