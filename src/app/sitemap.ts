import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getTipsByTool, type Tool } from "@/lib/content";
import {
  buildLanguageAlternates,
  getLocalePath,
  toAbsoluteUrl,
} from "@/lib/seo";

const validTools: Tool[] = ["claude-code", "gpt-codex", "gemini-cli"];

const staticPages = [
  {
    path: "",
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "/whats-new",
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
];

function resolveLastModifiedDate(dates: string[]): string {
  if (dates.length === 0) {
    return new Date().toISOString();
  }

  const latestDate = dates.reduce((latest, current) => {
    return new Date(current) > new Date(latest) ? current : latest;
  }, dates[0]);

  return new Date(latestDate).toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: toAbsoluteUrl(getLocalePath(locale, page.path)),
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: buildLanguageAlternates(page.path),
        },
      });
    }

    for (const tool of validTools) {
      const canonicalTips = getTipsByTool("en", tool);
      const toolPath = `/${tool}`;

      entries.push({
        url: toAbsoluteUrl(getLocalePath(locale, toolPath)),
        lastModified: resolveLastModifiedDate(canonicalTips.map((tip) => tip.date)),
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: {
          languages: buildLanguageAlternates(toolPath),
        },
      });

      for (const tip of canonicalTips) {
        const tipPath = `/${tool}/${tip.slug}`;

        entries.push({
          url: toAbsoluteUrl(getLocalePath(locale, tipPath)),
          lastModified: new Date(tip.date).toISOString(),
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: {
            languages: buildLanguageAlternates(tipPath),
          },
        });
      }
    }
  }

  return entries;
}
