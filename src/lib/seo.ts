import { defaultLocale, locales, type Locale } from "@/i18n/config";

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
    description: "Claude Code, GPT Codex, Gemini CLI의 최신 기능 업데이트 요약.",
  },
  en: {
    title: "What's New",
    description:
      "A curated roundup of the latest high-impact updates from Claude Code, GPT Codex, and Gemini CLI.",
  },
  es: {
    title: "Novedades",
    description:
      "Resumen curado de las novedades más importantes de Claude Code, GPT Codex y Gemini CLI.",
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
