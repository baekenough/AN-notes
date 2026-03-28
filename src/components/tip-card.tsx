import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TipMeta } from "@/lib/content";
import { formatIsoDate } from "@/lib/utils";

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface TipCardProps {
  tip: TipMeta;
  locale: string;
  difficultyLabels: Record<string, string>;
}

export function TipCard({ tip, locale, difficultyLabels }: TipCardProps) {
  const formattedDate = formatIsoDate(tip.date, locale);

  return (
    <Link
      href={`/${locale}/${tip.tool}/${tip.slug}`}
      className="group focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
      aria-label={`${tip.title} — ${difficultyLabels[tip.difficulty]}, ${formattedDate}, ${tip.readingTime} min read`}
    >
      <Card className="h-full transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className={difficultyColors[tip.difficulty]}
            >
              {difficultyLabels[tip.difficulty]}
            </Badge>
            <div className="text-right min-w-fit">
              <time
                dateTime={tip.date}
                className="block text-[11px] text-muted-foreground"
              >
                {formattedDate}
              </time>
              <span
                className="block text-xs text-muted-foreground font-mono"
                aria-label={`${tip.readingTime} minute read`}
              >
                {tip.readingTime}m
              </span>
            </div>
          </div>
          <CardTitle className="text-base sm:text-lg leading-tight group-hover:text-primary transition-colors break-words">
            {tip.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {tip.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap" aria-label="Tags">
              {tip.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            {tip.connections.length > 0 && (
              <span
                className="text-xs text-muted-foreground"
                aria-label={`${tip.connections.length} connected guide${tip.connections.length === 1 ? '' : 's'}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline mr-0.5"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {tip.connections.length}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
