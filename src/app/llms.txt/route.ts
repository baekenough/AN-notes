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
    `- [${toolConfig.name} index](${toAbsoluteUrl(getLocalePath("en", `/${tool}`))}): ${tips.length} canonical guides and practical workflows.`,
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
    "> Practical, human-written guides for Claude Code, GPT Codex, and Gemini CLI.",
    "",
    `${siteName} is a multilingual documentation site focused on real-world AI coding workflows.`,
    "Content is published in English, Korean, and Spanish using stable locale-prefixed URLs.",
    "",
    "## Canonical entry points",
    `- [Homepage (English)](${toAbsoluteUrl(getLocalePath("en"))})`,
    `- [Homepage (Korean)](${toAbsoluteUrl(getLocalePath("ko"))})`,
    `- [Homepage (Spanish)](${toAbsoluteUrl(getLocalePath("es"))})`,
    `- [What's New](${toAbsoluteUrl(getLocalePath("en", "/whats-new"))})`,
    "",
    "## Tool indexes",
    ...activeTools.flatMap((tool) => buildToolSection(tool)),
    "",
    "## Featured guides",
    ...featuredTips.map((tip) => {
      const url = toAbsoluteUrl(getLocalePath("en", `/${tip.tool}/${tip.slug}`));
      return `- [${tip.title}](${url}): ${tip.description}`;
    }),
    "",
    "## Optional",
    `- [agents.txt](${siteUrl}/agents.txt): machine-readable site index for autonomous agents.`,
    `- [sitemap.xml](${siteUrl}/sitemap.xml): complete crawl/index URL inventory.`,
    `- [robots.txt](${siteUrl}/robots.txt): crawler rules and sitemap declaration.`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
