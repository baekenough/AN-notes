import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const localeDateMap: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  es: "es-ES",
};

export function formatIsoDate(date: string, locale: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  return new Intl.DateTimeFormat(localeDateMap[locale] ?? "en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
