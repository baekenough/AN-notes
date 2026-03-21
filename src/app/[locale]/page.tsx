import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { tools } from "@/lib/tools";
import { getAllTips } from "@/lib/content";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const allTips = getAllTips(locale);
  const featuredTips = allTips.filter(tip => tip.featured);

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
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitleLine1")}
              <br />
              {t("hero.subtitleLine2")}
            </p>

          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 border-t border-border/40">
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

      {/* Featured Tips */}
      {featuredTips.length > 0 && (
        <section className="py-16 border-t border-border/40">
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
