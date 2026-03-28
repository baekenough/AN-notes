import { createSocialImageResponse, socialImageSize } from "@/lib/social-image";

export const alt =
  "AI Native Notes social card showing practical AI coding guides for Claude Code, GPT Codex, and Gemini CLI.";
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createSocialImageResponse({
    eyebrow: "Practical AI coding guides",
    title: "Workflows, MCP, sandbox, and multi-agent playbooks",
    description:
      "Human-written guides for Claude Code, GPT Codex, and Gemini CLI in English, Korean, and Spanish.",
    accentFrom: "#fb923c",
    accentTo: "#34d399",
    tags: ["Claude Code", "GPT Codex", "Gemini CLI", "MCP"],
  });
}
