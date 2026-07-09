"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";

/** Compare paths ignoring trailing slashes (static export uses trailingSlash). */
const samePath = (a: string, b: string) =>
  a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

/** In-page section nav for the pharma-landing draft — anchors, not routes. */
const PHARMA_LANDING_NAV = [
  { label: "Data Coverage", href: "#data-coverage" },
  { label: "Why Us", href: "#why-us" },
  { label: "Intelligence Features", href: "#intelligence-features" },
  { label: "HSN Coverage", href: "#hsn-coverage" },
  { label: "Global Coverage", href: "#global-coverage" },
  { label: "Use Cases", href: "#use-cases" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // The pharma-landing draft is a self-contained review page — its nav
  // shouldn't send reviewers wandering into the rest of (unfinished) site.
  const isPharmaLanding = pathname?.startsWith("/pharma-landing");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Restore focus to the toggle after the menu closes.
  function closeMobile() {
    setMobileOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/90 backdrop-blur transition-[height,box-shadow]",
        scrolled ? "border-border shadow-xs" : "border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex items-center gap-3 px-4 transition-[padding] sm:px-6",
          isPharmaLanding ? "max-w-[1400px]" : "max-w-6xl",
          scrolled ? "py-2.5" : "py-3.5",
        )}
      >
        <div className="shrink-0">
          <Logo />
        </div>

        {isPharmaLanding ? (
          <ul className={cn("hidden flex-1 items-center justify-center gap-0.5", "xl:flex")}>
            {PHARMA_LANDING_NAV.map((item) => (
              <li key={item.label} className="shrink-0">
                <a
                  href={item.href}
                  className="whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-strong hover:bg-surface hover:text-navy"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {mainNav.map((item) =>
              item.children ? (
                <DropdownNav key={item.label} item={item} pathname={pathname} />
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-strong hover:bg-surface hover:text-navy",
                      samePath(pathname, item.href) && "text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        )}

        <div className={cn("hidden shrink-0 items-center gap-2", isPharmaLanding ? "xl:flex" : "lg:flex")}>
          <Link
            href="/login"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-strong hover:text-navy"
          >
            Sign in
          </Link>
          <ButtonLink href="/demo" variant="outline" size="sm">
            Explore Demo
          </ButtonLink>
          <ButtonLink href="/contact" variant="primary" size="sm">
            Request a Demo
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-md p-2 text-navy hover:bg-surface",
            isPharmaLanding ? "xl:hidden" : "lg:hidden",
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {mobileOpen ? (
        <MobileMenu pathname={pathname} onNavigate={closeMobile} useAnchorNav={isPharmaLanding} />
      ) : null}
    </header>
  );
}

function DropdownNav({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active =
    samePath(pathname, item.href) ||
    (item.children?.some((c) => samePath(pathname, c.href)) ?? false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-surface hover:text-navy",
          active ? "text-primary" : "text-muted-strong",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-full w-72 pt-2">
          <ul className="overflow-hidden rounded-lg border border-border bg-background p-2 shadow-md">
            {item.children!.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={cn(
                    "block rounded-md px-3 py-2 hover:bg-surface",
                    samePath(pathname, child.href) && "bg-primary-soft",
                  )}
                >
                  <span className="block text-sm font-semibold text-navy">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="block text-xs text-muted">
                      {child.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function MobileMenu({
  pathname,
  onNavigate,
  useAnchorNav = false,
}: {
  pathname: string;
  onNavigate: () => void;
  useAnchorNav?: boolean;
}) {
  return (
    <div
      id="mobile-menu"
      onClick={(e) => {
        // Close the menu when any link inside is activated.
        if ((e.target as HTMLElement).closest("a")) onNavigate();
      }}
      className={cn("border-t border-border bg-background", useAnchorNav ? "xl:hidden" : "lg:hidden")}
    >
      <div className="mx-auto max-w-6xl space-y-1 px-4 py-4 sm:px-6">
        {useAnchorNav
          ? PHARMA_LANDING_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-surface"
              >
                {item.label}
              </a>
            ))
          : mainNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-semibold text-navy hover:bg-surface",
                    samePath(pathname, item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-md px-3 py-1.5 text-sm text-muted-strong hover:bg-surface"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
        <div className="grid gap-2 pt-3">
          <ButtonLink href="/login" variant="ghost" className="justify-start">
            Sign in
          </ButtonLink>
          <ButtonLink href="/demo" variant="outline">
            Explore Demo
          </ButtonLink>
          <ButtonLink href="/contact" variant="primary">
            Request a Demo
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
