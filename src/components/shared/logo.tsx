import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Vaskodigama logo.
 *
 * ⚠️ TEMPORARY WORDMARK — no official logo asset was supplied. This is a clean
 * placeholder (a compass mark, nodding to the explorer name, deliberately
 * avoiding cargo-ship clichés). To use the real logo:
 *   1. Drop the SVG into /public/brand/logo.svg
 *   2. Replace the inline <svg> mark below with <Image src="/brand/logo.svg" .../>
 *      OR paste the official SVG path data in place of the mark.
 *   3. Do NOT redraw, stretch, recolour, or add decoration to the approved logo.
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
        "inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-navy",
        className,
      )}
      aria-label="Vaskodigama home"
    >
      <LogoMark className="size-8 text-primary" />
      {showText ? <span>Vaskodigama</span> : null}
    </Link>
  );
}
