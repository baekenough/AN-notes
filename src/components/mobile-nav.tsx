'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools";

export function MobileNav({
  locale,
  whatsNewLabel,
}: {
  locale: string;
  whatsNewLabel: string;
}) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setOpenPathname(current => (current === pathname ? null : pathname));
  };

  const closeMenu = () => {
    setOpenPathname(null);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-background/60 backdrop-blur-sm z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-menu"
        className={`absolute top-16 left-0 right-0 bg-background border-b border-border p-4 z-50 shadow-lg transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col">
          <Link
            href={`/${locale}/whats-new`}
            onClick={closeMenu}
            className="flex items-center gap-2 min-h-[48px] text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors px-2 focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            {whatsNewLabel}
          </Link>
          {tools.map((tool) =>
            tool.status === 'active' ? (
              <Link
                key={tool.id}
                href={`/${locale}/${tool.id}`}
                onClick={closeMenu}
                className="flex items-center min-h-[48px] text-sm font-medium text-foreground hover:text-primary transition-colors px-2 focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                {tool.name}
              </Link>
            ) : (
              <span
                key={tool.id}
                className="flex items-center min-h-[48px] text-sm font-medium text-muted-foreground/50 px-2 cursor-default"
                aria-disabled="true"
              >
                {tool.name}
                <span className="ml-2 text-xs">(Coming Soon)</span>
              </span>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
