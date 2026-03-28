import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { Tool } from "@/lib/content";

const FALLBACK_SITE_URL = "https://annotes.baekenough.com";

function normalizeSiteUrl(raw: string): string {
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

function dedupeKeywords(...groups: ReadonlyArray<readonly string[]>): string[] {
  return Array.from(new Set(groups.flat()));
}

export const siteName = "AI Native Notes";
export const siteAuthorName = "Sangyi Baek";
export const siteGitHubUrl = "https://github.com/baekenough/AN-notes";
export const siteLinkedInUrl = "https://www.linkedin.com/in/sangyi-baek-a8b028203/";
export const siteOwnerName = siteAuthorName;
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL,
);
export const defaultOpenGraphImagePath = "/opengraph-image";
export const defaultTwitterImagePath = "/twitter-image";
export const siteAuthor = {
  "@type": "Person",
  name: siteAuthorName,
};
export const sitePublisher = {
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: siteName,
  url: siteUrl,
  sameAs: [siteGitHubUrl, siteLinkedInUrl],
};

const localeDescriptions: Record<Locale, string> = {
  ko: "Claude Code, GPT Codex, Gemini CLI를 위한 실전 설치·워크플로·자동화 가이드 모음",
  en: "Human-written setup, workflow, sandbox, MCP, and automation guides for Claude Code, GPT Codex, and Gemini CLI",
  es: "Guías prácticas de instalación, workflows, sandbox, MCP y automatización para Claude Code, GPT Codex y Gemini CLI",
};

const sharedKeywords: Record<Locale, string[]> = {
  ko: [
    "AI 코딩",
    "Claude Code",
    "GPT Codex",
    "Gemini CLI",
    "AGENTS.md",
    "MCP",
    "sandbox",
    "AI 워크플로",
    "개발자 가이드",
  ],
  en: [
    "AI coding guides",
    "Claude Code",
    "GPT Codex",
    "Gemini CLI",
    "AGENTS.md",
    "MCP",
    "sandboxing",
    "multi-agent workflows",
    "developer guides",
  ],
  es: [
    "guías de programación con IA",
    "Claude Code",
    "GPT Codex",
    "Gemini CLI",
    "AGENTS.md",
    "MCP",
    "sandbox",
    "workflows con agentes",
    "guías para desarrolladores",
  ],
};

const homeSeoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: "AI 코딩 도구를 제대로 사용하기",
    description:
      "Claude Code, GPT Codex, Gemini CLI를 위한 실전 설치·워크플로·자동화 가이드를 한국어·영어·스페인어로 제공합니다.",
  },
  en: {
    title: "Use AI Coding Tools the Right Way",
    description:
      "Practical setup, workflow, sandbox, MCP, and automation guides for Claude Code, GPT Codex, and Gemini CLI in English, Korean, and Spanish.",
  },
  es: {
    title: "Usa herramientas de IA de la manera correcta",
    description:
      "Guías prácticas de instalación, workflow, sandbox, MCP y automatización para Claude Code, GPT Codex y Gemini CLI en español, inglés y coreano.",
  },
};

const homeKeywords: Record<Locale, string[]> = {
  ko: ["AI 코딩 도구", "AI Native Notes", "실전 가이드", "프롬프트", "자동화"],
  en: ["AI Native Notes", "AI coding tools", "practical guides", "prompting", "automation"],
  es: ["AI Native Notes", "herramientas de IA", "guías prácticas", "prompts", "automatización"],
};

const whatsNewSeoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: "새 소식",
    description:
      "Claude Code, GPT Codex, Gemini CLI의 주요 기능 변화와 최근 가이드 업데이트를 한 번에 살펴보세요.",
  },
  en: {
    title: "What's New",
    description:
      "A curated roundup of major product updates and freshly updated guides for Claude Code, GPT Codex, and Gemini CLI.",
  },
  es: {
    title: "Novedades",
    description:
      "Resumen curado de cambios importantes del producto y guías recién actualizadas de Claude Code, GPT Codex y Gemini CLI.",
  },
};

const whatsNewKeywords: Record<Locale, string[]> = {
  ko: ["제품 업데이트", "최근 가이드", "AI 도구 변화"],
  en: ["product updates", "latest guides", "AI tool changes"],
  es: ["actualizaciones de producto", "guías recientes", "cambios en herramientas de IA"],
};

const toolSeoTitles: Record<Locale, Record<Tool, string>> = {
  ko: {
    "claude-code": "Claude Code 가이드",
    "gpt-codex": "GPT Codex 가이드",
    "gemini-cli": "Gemini CLI 가이드",
  },
  en: {
    "claude-code": "Claude Code Guides",
    "gpt-codex": "GPT Codex Guides",
    "gemini-cli": "Gemini CLI Guides",
  },
  es: {
    "claude-code": "Guías de Claude Code",
    "gpt-codex": "Guías de GPT Codex",
    "gemini-cli": "Guías de Gemini CLI",
  },
};

const toolKeywords: Record<Locale, Record<Tool, string[]>> = {
  ko: {
    "claude-code": ["Claude Code 튜토리얼", "agent teams", "hooks", "worktrees"],
    "gpt-codex": ["GPT Codex 튜토리얼", "AGENTS.md", "sandbox", "subagents"],
    "gemini-cli": ["Gemini CLI 튜토리얼", "long context", "trusted folders", "automation"],
  },
  en: {
    "claude-code": ["Claude Code tutorials", "agent teams", "hooks", "worktrees"],
    "gpt-codex": ["GPT Codex tutorials", "AGENTS.md", "sandbox", "subagents"],
    "gemini-cli": ["Gemini CLI tutorials", "long context", "trusted folders", "automation"],
  },
  es: {
    "claude-code": ["tutoriales de Claude Code", "agent teams", "hooks", "worktrees"],
    "gpt-codex": ["tutoriales de GPT Codex", "AGENTS.md", "sandbox", "subagents"],
    "gemini-cli": ["tutoriales de Gemini CLI", "long context", "trusted folders", "automation"],
  },
};

const ogLocaleMap: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  es: "es_ES",
};

export function ensureLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export function getLocaleDescription(locale: Locale): string {
  return localeDescriptions[locale];
}

export function getSiteKeywords(locale: Locale): string[] {
  return sharedKeywords[locale];
}

export function mergeKeywords(
  ...groups: Array<readonly string[] | undefined>
): string[] {
  return dedupeKeywords(...groups.map(group => [...(group ?? [])]));
}

export function getHomeSeoCopy(locale: Locale): { title: string; description: string } {
  return homeSeoCopy[locale];
}

export function getHomeKeywords(locale: Locale): string[] {
  return dedupeKeywords(sharedKeywords[locale], homeKeywords[locale]);
}

export function getWhatsNewSeoCopy(locale: Locale): {
  title: string;
  description: string;
} {
  return whatsNewSeoCopy[locale];
}

export function getWhatsNewKeywords(locale: Locale): string[] {
  return dedupeKeywords(sharedKeywords[locale], whatsNewKeywords[locale]);
}

export function getToolSeoCopy(
  locale: Locale,
  tool: Tool,
  tipCount: number,
): { title: string; description: string } {
  const title = toolSeoTitles[locale][tool];

  switch (locale) {
    case "ko":
      return {
        title,
        description: `${title.replace(" 가이드", "")}를 실무에 활용하기 위한 ${tipCount}개의 실전 가이드와 팁.`,
      };
    case "es":
      return {
        title,
        description: `${tipCount} guías y tips prácticos de ${title.replace(
          "Guías de ",
          "",
        )} para trabajar mejor con IA.`,
      };
    case "en":
    default:
      return {
        title,
        description: `${tipCount} practical ${title.replace(
          " Guides",
          "",
        )} guides and tips for AI-assisted development.`,
      };
  }
}

export function getToolKeywords(locale: Locale, tool: Tool): string[] {
  return dedupeKeywords(sharedKeywords[locale], toolKeywords[locale][tool]);
}

export function getOgLocale(locale: Locale): string {
  return ogLocaleMap[locale];
}

export function normalizePath(path = ""): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getLocalePath(locale: Locale, path = ""): string {
  const normalizedPath = normalizePath(path);
  return `/${locale}${normalizedPath}`;
}

export function toAbsoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, toAbsoluteUrl(getLocalePath(locale, path))]),
  );
}

export function getDefaultOpenGraphImageUrl(): string {
  return toAbsoluteUrl(defaultOpenGraphImagePath);
}

export function getDefaultTwitterImageUrl(): string {
  return toAbsoluteUrl(defaultTwitterImagePath);
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getSiteOrganizationJsonLd() {
  return sitePublisher;
}

export function getSiteWebsiteJsonLd(locale: Locale, description: string) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: locale,
    description,
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
  };
}
