import { getAllTips, getTipsByTool, type Tool } from "@/lib/content";
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
    `### ${toolConfig.name}`,
    `- Canonical index: ${toAbsoluteUrl(getLocalePath("en", `/${tool}`))}`,
    `- Summary: ${toolConfig.discoverySummary}`,
    `- Topic clusters: ${toolConfig.discoveryTopics.join(", ")}`,
    `- Canonical guide count: ${tips.length}`,
    ...tips.slice(0, 4).map(
      (tip) =>
        `- Recommended read: ${tip.title} — ${toAbsoluteUrl(getLocalePath("en", `/${tool}/${tip.slug}`))}`,
    ),
    "",
  ];
}

export function GET(): Response {
  const featuredTips = getAllTips("en")
    .filter((tip) => tip.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 12);

  const body = [
    `# ${siteName}`,
    "",
    "> Human-written guides for Claude Code, GPT Codex, and Gemini CLI.",
    "",
    `${siteName} is a multilingual documentation site focused on real-world AI coding workflows.`,
    "Content is published in English, Korean, and Spanish using stable locale-prefixed URLs.",
    "",
    "## Audience",
    "- Developers comparing AI coding tools before standardizing on one workflow.",
    "- Teams documenting repo instructions, sandboxing, MCP, and automation conventions.",
    "- AI agents that need canonical entry points, topical clusters, and freshness hints.",
    "",
    "## Editorial focus",
    "- Getting started and installation",
    "- Repo instruction systems such as AGENTS.md and CLAUDE.md",
    "- Sandboxing, approvals, and safety boundaries",
    "- MCP, skills, automation, and multi-agent execution",
    "- Recent product changes and guide refreshes",
    "",
    "## Canonical entry points",
    `- Homepage (English): ${toAbsoluteUrl(getLocalePath("en"))}`,
    `- Homepage (Korean): ${toAbsoluteUrl(getLocalePath("ko"))}`,
    `- Homepage (Spanish): ${toAbsoluteUrl(getLocalePath("es"))}`,
    `- What's New: ${toAbsoluteUrl(getLocalePath("en", "/whats-new"))}`,
    "",
    "## Freshness signals",
    "- Article pages expose updated dates in the UI.",
    "- /whats-new summarizes the current release surface for each tool.",
    "- /sitemap.xml and /agents.txt keep the canonical URL inventory current.",
    "",
    "## Tool indexes",
    ...activeTools.flatMap((tool) => buildToolSection(tool)),
    "## Featured guides",
    ...featuredTips.map((tip) => {
      const url = toAbsoluteUrl(getLocalePath("en", `/${tip.tool}/${tip.slug}`));
      return `- ${tip.title}: ${tip.description} (${url})`;
    }),
    "",
    "## Machine-readable companions",
    `- agents.txt: ${siteUrl}/agents.txt — compact index for autonomous agents.`,
    `- sitemap.xml: ${siteUrl}/sitemap.xml — complete crawl/index URL inventory.`,
    `- robots.txt: ${siteUrl}/robots.txt — crawler rules and sitemap declaration.`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
