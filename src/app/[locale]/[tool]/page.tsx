import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTipsByTool, type Tool } from "@/lib/content";
import { getToolConfig } from "@/lib/tools";
import { TipCard } from "@/components/tip-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const validTools: Tool[] = ["claude-code", "gpt-codex", "gemini-cli"];

export function generateStaticParams() {
  return validTools.map(tool => ({ tool }));
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
