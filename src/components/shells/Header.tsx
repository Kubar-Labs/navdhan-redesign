"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/src/components/layout/Container";
import { cn } from "@/src/lib/utils/cn";
import { defaultLocale, localeOptions, isValidLocale, type Locale } from "@/src/lib/i18n/config";

export interface NavLink {
  label: string;
  href: string;
}

export interface CtaButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface HeaderProps {
  navLinks: NavLink[];
  cta: CtaButton;
  currentLocale: string;
}

function stripLocalePrefix(pathname: string): string {
  const [, firstSegment, ...rest] = pathname.split("/");
  if (firstSegment && isValidLocale(firstSegment)) {
    return "/" + rest.join("/");
  }
  return pathname;
}

export function Header({ navLinks, cta, currentLocale }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const pathnameWithoutLocale = stripLocalePrefix(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-nt-slate-200 bg-nt-white/95 backdrop-blur">
      <Container size="default">
        <nav aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
          <Link
            href={`/${currentLocale}`}
            className="text-lg font-bold text-nt-slate-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
          >
            NavDhan
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            <ul className="hidden items-center gap-4 text-sm font-medium text-nt-slate-700 md:flex">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-nt-slate-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <LocaleSelector
              currentLocale={currentLocale}
              pathnameWithoutLocale={pathnameWithoutLocale}
            />

            <Link
              href={cta.href}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                cta.variant === "secondary"
                  ? "border border-nt-slate-300 text-nt-slate-900 hover:bg-nt-slate-50"
                  : "bg-nt-orange-600 text-white hover:bg-nt-orange-700",
                "focus-visible:outline-nt-orange-600",
              )}
            >
              {cta.label}
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}

interface LocaleSelectorProps {
  currentLocale: string;
  pathnameWithoutLocale: string;
}

function LocaleSelector({ currentLocale, pathnameWithoutLocale }: LocaleSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-nt-slate-700">
      <span className="sr-only">Choose language</span>
      <select
        value={currentLocale}
        onChange={(event) => {
          const locale = event.target.value as Locale;
          const target =
            locale === defaultLocale
              ? pathnameWithoutLocale || "/"
              : `/${locale}${pathnameWithoutLocale || ""}`;
          window.location.href = target;
        }}
        className="rounded-md border border-nt-slate-300 bg-nt-white px-2 py-1.5 text-sm focus-visible:border-nt-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
      >
        {localeOptions.map((option) => (
          <option key={option.value} value={option.value} lang={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Re-export defaultLocale so the locale selector can use it without a second import.
const defaultLocale = "en";
