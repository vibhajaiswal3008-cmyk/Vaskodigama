"use client";

import { usePathname } from "next/navigation";

/**
 * Development-preview notice. Renders ONLY when NEXT_PUBLIC_PREVIEW === "true"
 * (set in the preview deployment, not in local dev or production).
 *
 * Skipped on /pharma-landing — that route is a stakeholder-facing draft
 * meant to be reviewed as a finished page, not flagged as WIP on top of
 * its own (removed) internal draft banner.
 *
 * To remove for the final launch: delete this component, its import in
 * src/app/layout.tsx, and the NEXT_PUBLIC_PREVIEW env var on the host.
 */
export function PreviewBanner() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_PREVIEW !== "true") return null;
  if (pathname?.startsWith("/pharma-landing")) return null;
  return (
    <div
      role="note"
      aria-label="Development preview notice"
      style={{
        position: "fixed",
        left: "12px",
        bottom: "12px",
        zIndex: 70,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "var(--navy)",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 600,
        padding: "6px 12px",
        borderRadius: "999px",
        boxShadow: "var(--shadow-md)",
        pointerEvents: "none",
        maxWidth: "calc(100vw - 24px)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "999px",
          background: "var(--warning)",
          flexShrink: 0,
        }}
      />
      Development Preview — under review, not the final version
    </div>
  );
}
