import { locales } from "@/i18n/config";
import { getTipsByTool, type Tool } from "@/lib/content";
import { getToolConfig, tools } from "@/lib/tools";
import { getLocalePath, siteName, siteUrl, toAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const activeTools = tools
  .filter((tool) => tool.status === "active")
  .map((tool) => tool.id) as Tool[];

function buildToolSection(tool: Tool): string[] {
  const toolConfig = getToolConfig(tool);
  const tips = getTipsByTool("en", tool);

  return [
    `[${toolConfig.name}] ${tips.length} canonical articles, ${tips.length * locales.length} localized pages | source=${toolConfig.url}`,
    ...locales.map((locale) => `  index (${locale}): ${getLocalePath(locale, `/${tool}`)}`),
    `  pattern: /{locale}/${tool}/{slug}`,
    ...tips.map((tip) => `  - ${tip.slug}: ${toAbsoluteUrl(getLocalePath("en", `/${tool}/${tip.slug}`))}`),
    "",
  ];
}

export function GET(): Response {
  const today = new Date().toISOString().slice(0, 10);
  const canonicalTipCount = activeTools.reduce((total, tool) => {
    return total + getTipsByTool("en", tool).length;
  }, 0);
  const localizedTipPages = canonicalTipCount * locales.length;
  const staticPages = locales.length * (2 + activeTools.length);
  const totalPages = staticPages + localizedTipPages;

  const body = [
    "# agents.txt v0.2",
    `# ${siteName} — ${siteUrl}`,
    `# Documentation Sets: ${activeTools.length} | Total Pages: ${totalPages} | Last updated: ${today}`,
    "",
    `SITE: ${siteName}`,
    `URL: ${siteUrl}`,
    "TYPE: site-index",
    `LOCALES: ${locales.length}`,
    `SETS: ${activeTools.length}`,
    `PAGES: ${totalPages}`,
    "",
    "== ENTRYPOINTS ==",
    `home: ${toAbsoluteUrl(getLocalePath("en"))}`,
    `sitemap: ${siteUrl}/sitemap.xml`,
    `robots: ${siteUrl}/robots.txt`,
    `llms: ${siteUrl}/llms.txt`,
    "",
    "== DOCUMENTATION SETS ==",
    "",
    ...activeTools.flatMap((tool) => buildToolSection(tool)),
    "== NAVIGATION ==",
    "RULES:",
    "1. Use /sitemap.xml for complete URL discovery.",
    "2. Use /llms.txt for curated LLM-first context.",
    "3. All user-facing pages are locale-prefixed: /en, /ko, /es.",
    "4. Canonical slug source is English; localized pages reuse the same slug.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
