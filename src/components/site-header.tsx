import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { tools } from "@/lib/tools";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader({ locale }: { locale: string }) {
  const activeTools = tools.filter((tool) => tool.status === "active");
  const comingSoonTools = tools.filter(
    (tool) => tool.status === "coming-soon"
  );
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            <span className="text-xl font-bold tracking-tight">
              AI Native{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Notes
              </span>
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            <Link
              href={`/${locale}/whats-new`}
              className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded flex items-center gap-1"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {t("whatsNew")}
            </Link>
            {activeTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${locale}/${tool.id}`}
                className={`text-sm font-medium text-muted-foreground hover:${tool.color} transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded`}
              >
                {tool.name}
              </Link>
            ))}
            {comingSoonTools.map((tool) => (
              <span
                key={tool.id}
                className="text-sm text-muted-foreground/50 cursor-default"
                aria-label={`${tool.name} (coming soon)`}
              >
                {tool.name}
                <span
                  className="ml-1 text-xs text-muted-foreground/30"
                  aria-hidden="true"
                >
                  (soon)
                </span>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <MobileNav locale={locale} whatsNewLabel={t("whatsNew")} />
        </div>
      </div>
    </header>
  );
}
