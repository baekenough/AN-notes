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

export const siteName = "AI Native Notes";
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL,
);

const localeDescriptions: Record<Locale, string> = {
  ko: "AI 코딩 도구를 마스터하세요 — Claude Code, GPT Codex, 그리고 더 많은 도구들",
  en: "Master your AI coding tools — Claude Code, GPT Codex, and more",
  es: "Domina tus herramientas de programación con IA — Claude Code, GPT Codex y más",
};

const homeSeoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: "AI 코딩 도구를 제대로 사용하기",
    description:
      "Claude Code, GPT Codex, Gemini CLI를 위한 실전 팁과 가이드. 한국어·영어·스페인어로 제공됩니다.",
  },
  en: {
    title: "Use AI Coding Tools the Right Way",
    description:
      "Practical guides for Claude Code, GPT Codex, and Gemini CLI in English, Korean, and Spanish.",
  },
  es: {
    title: "Usa herramientas de IA de la manera correcta",
    description:
      "Guías prácticas de Claude Code, GPT Codex y Gemini CLI en español, inglés y coreano.",
  },
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

export function getHomeSeoCopy(locale: Locale): { title: string; description: string } {
  return homeSeoCopy[locale];
}

export function getWhatsNewSeoCopy(locale: Locale): {
  title: string;
  description: string;
} {
  return whatsNewSeoCopy[locale];
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
