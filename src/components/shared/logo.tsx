import Link from "next/link";
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
  return (
    <Link
      href={href}
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
