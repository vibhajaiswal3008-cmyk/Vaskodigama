"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Vaskodigama wordmark. Text-based approximation of the live brand mark
 * (VΛSKØDIGAMA, styled with Λ/Ø letterforms) — no official SVG asset has
 * been supplied. If one becomes available, replace the <span> below with
 * <Image src="/brand/logo.svg" .../> rather than redrawing or recolouring.
 * LogoMark (the compass glyph) is kept for icon-only contexts (e.g. a
 * collapsed sidebar) where the full wordmark doesn't fit.
 */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
      role="presentation"
      fill="none"
    >
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      {/* Compass needle */}
      <path d="M16 4 L20 16 L16 13 L12 16 Z" fill="currentColor" />
      <path
        d="M16 28 L12 16 L16 19 L20 16 Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  // The pharma-landing draft isn't linked from site navigation yet, so its
  // logo must not send reviewers off to the (different) real homepage —
  // keep it anchored to this same page instead. Every other route keeps
  // its normal `href` (defaults to "/").
  const pathname = usePathname();
  const isPharmaLanding = pathname?.startsWith("/pharma-landing");
  const resolvedHref = isPharmaLanding ? "#top" : href;

  // next/link doesn't reliably auto-scroll for a same-page hash target (the
  // URL updates but the viewport doesn't move), so drive the scroll
  // ourselves. `href="#top"` stays as a real fallback (no-JS, new-tab, etc).
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!isPharmaLanding) return;
    e.preventDefault();
    document.getElementById("top")?.scrollIntoView({ behavior: "instant" });
  }

  return (
    <Link
      href={resolvedHref}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center font-heading text-xl font-extrabold tracking-tight text-navy",
        className,
      )}
      aria-label="Vaskodigama home"
    >
      {showText ? <span>VΛSKØDIGAMA</span> : <LogoMark className="size-8 text-primary" />}
    </Link>
  );
}
