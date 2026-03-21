import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { TipConnection } from "@/lib/content";
import { getConnectedTips } from "@/lib/content";
import { getToolConfig } from "@/lib/tools";

const connectionLabels: Record<string, Record<string, string>> = {
  en: {
    prerequisite: "Start here first",
    enhances: "Works great with",
    compare: "Compare approaches",
    combines: "Use together",
  },
  ko: {
    prerequisite: "먼저 읽기",
    enhances: "함께 활용하기",
    compare: "비교하기",
    combines: "같이 사용하기",
  },
  es: {
    prerequisite: "Empieza aquí",
    enhances: "Funciona bien con",
    compare: "Compara enfoques",
    combines: "Usar juntos",
  },
};

const connectionColors: Record<string, string> = {
  prerequisite: "border-l-amber-500",
  enhances: "border-l-emerald-500",
  compare: "border-l-blue-500",
  combines: "border-l-purple-500",
};

interface ConnectedGuidesProps {
  connections: TipConnection[];
  locale: string;
  title: string;
}

export function ConnectedGuides({
  connections,
  locale,
  title,
}: ConnectedGuidesProps) {
  const connectedTips = getConnectedTips(locale, connections);

  if (connectedTips.length === 0) return null;

  const labels = connectionLabels[locale] ?? connectionLabels.en;

  return (
    <section
      className="mt-12 pt-8 border-t border-border"
      aria-labelledby="connected-guides-heading"
    >
      <h2
        id="connected-guides-heading"
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {title}
      </h2>
      <div className="grid gap-3" role="list">
        {connectedTips.map((tip, i) => {
          const conn = connections[i];
          const toolConfig = getToolConfig(tip.tool);
          const borderColor = connectionColors[conn.type] ?? '';
          const label = labels[conn.type] ?? conn.type;

          return (
            <div key={`${tip.tool}-${tip.slug}`} role="listitem">
              <Link
                href={`/${locale}/${tip.tool}/${tip.slug}`}
                className="group focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
                aria-label={`${tip.title} — ${toolConfig.name}, ${label}`}
              >
                <Card
                  className={`transition-all hover:border-primary/30 hover:-translate-y-0.5 border-l-4 ${borderColor}`}
                >
                  <CardContent className="flex items-center justify-between py-4 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${toolConfig.gradient} flex items-center justify-center text-sm font-bold ${toolConfig.color} flex-shrink-0`}
                        aria-hidden="true"
                      >
                        {toolConfig.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium group-hover:text-primary transition-colors text-sm truncate">
                          {tip.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {toolConfig.name} · {label}
                        </p>
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
