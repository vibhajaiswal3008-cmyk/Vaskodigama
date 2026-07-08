"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { footerNav, siteConfig } from "@/config/site";
import { CookiePreferencesButton } from "@/components/shared/cookie-preferences";

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  // Same reasoning as the header: don't link this self-contained review
  // page's footer out into the rest of the (unfinished) site.
  const isPharmaLanding = pathname?.startsWith("/pharma-landing");

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted">
              Trade intelligence that helps you decide what to do next — discover
              markets, evaluate buyers and suppliers, and turn shipment records
              into clear business decisions.
            </p>
            <p className="mt-4 text-xs text-muted">
              Demonstration build. All trade data shown is illustrative.
            </p>
          </div>

          {isPharmaLanding
            ? null
            : footerNav.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h2 className="text-sm font-semibold text-navy">{group.title}</h2>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-muted hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Illustrative demonstration — not
            connected to a live customs data source.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
