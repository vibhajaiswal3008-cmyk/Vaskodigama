"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useDismissible } from "@/hooks/use-dismissible";

/** Subtle, dismissible announcement. No fake urgency. Remembers dismissal. */
export function AnnouncementStrip() {
  const { dismissed, dismiss } = useDismissible("announcement");
  const pathname = usePathname();

  // The pharma-landing draft renders its own in-page announcement strip
  // (anchored to its own Global Coverage section); skip the sitewide one
  // there so it doesn't duplicate it or link visitors off the draft page.
  if (dismissed || pathname?.startsWith("/pharma-landing")) return null;

  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 text-sm sm:px-6">
        <span className="text-center text-white/90">
          Explore trade intelligence across 40 global markets
        </span>
        <Link
          href="/countries"
          className="group inline-flex shrink-0 items-center gap-1.5 font-medium hover:underline"
        >
          <span>View country coverage</span>
          <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="ml-auto rounded p-1 text-white/70 hover:text-white"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
