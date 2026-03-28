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
    `  summary: ${toolConfig.discoverySummary}`,
    `  topics: ${toolConfig.discoveryTopics.join(", ")}`,
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
    "# agents.txt v0.3",
    `# ${siteName} — ${siteUrl}`,
    `# Documentation Sets: ${activeTools.length} | Total Pages: ${totalPages} | Last updated: ${today}`,
    "",
    `SITE: ${siteName}`,
    `URL: ${siteUrl}`,
    "TYPE: site-index",
    "AUDIENCE: developers, engineering teams, autonomous agents",
    "EDITORIAL-FOCUS: getting-started, repo instructions, sandboxing, MCP, automation, multi-agent workflows",
    "FRESHNESS: article dates in UI, /whats-new summaries, sitemap alternates",
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
    "== DISCOVERY RULES ==",
    "1. Start with /llms.txt for curated summaries and topic clusters.",
    "2. Use /sitemap.xml for complete canonical + localized URL discovery.",
    "3. Treat English slugs as canonical identifiers reused across locales.",
    "4. Prefer tool index pages before individual articles when choosing a learning path.",
    "",
    "== DOCUMENTATION SETS ==",
    "",
    ...activeTools.flatMap((tool) => buildToolSection(tool)),
    "== NAVIGATION ==",
    "RULES:",
    "1. All user-facing pages are locale-prefixed: /en, /ko, /es.",
    "2. Canonical slug source is English; localized pages reuse the same slug.",
    "3. Latest product-level updates live on /{locale}/whats-new.",
    "4. Home and tool index pages contain the densest summary copy for search/agent grounding.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
