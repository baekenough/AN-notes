import { createSocialImageResponse, socialImageSize } from "@/lib/social-image";

export const alt =
  "AI Native Notes Twitter card showing practical AI coding guides for Claude Code, GPT Codex, and Gemini CLI.";
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createSocialImageResponse({
    eyebrow: "AI Native Notes",
    title: "Search-friendly, agent-friendly AI coding guides",
    description:
      "Compare tool workflows, sandbox rules, and automation patterns across Claude Code, GPT Codex, and Gemini CLI.",
    accentFrom: "#38bdf8",
    accentTo: "#f97316",
    tags: ["Guides", "Automation", "Sandbox", "Agents"],
  });
}
