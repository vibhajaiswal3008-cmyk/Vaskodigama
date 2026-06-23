# CLAUDE.md — Vaskodigama

Guidance for any AI or human contributor working in this repository.

## Project purpose

Vaskodigama is a global **trade-intelligence** product. It helps exporters,
importers and analysts discover markets, evaluate buyers and suppliers, and
turn shipment records into clear business decisions.

Positioning: **"Trade data that tells you what to do next."**
Product journey: **Discover → Understand → Compare → Decide → Connect.**

This repo contains two connected experiences:

- A public marketing site (`src/app/(marketing)`)
- A demo-authenticated application dashboard (`src/app/dashboard`)

## Brand principles

Intelligent, dependable, calm, international, evidence-led, helpful, human,
approachable. Never cold, aggressive, cluttered, or like a shipping/logistics/
crypto site. Lead with **decisions and evidence**, not record counts.

## Design rules

- Blue-led system. Tokens live in `src/app/globals.css` (`@theme`) — use them
  (`bg-primary`, `text-navy`, `border-border`, `text-muted`, chart-1..6). Do
  **not** hardcode hex values in components.
- Fonts: Manrope (headings) + Inter (body) via `next/font` (see `layout.tsx`).
- Generous whitespace, soft corners (`rounded-md/lg`), subtle shadows.
- Avoid: purple gradients, neon, heavy glassmorphism, decorative globes/cargo
  ships, constant particle animation, invented numeric counters.
- Motion is restrained and must respect `prefers-reduced-motion` (handled
  globally in `globals.css`; gate any JS animation too).

## Code conventions

- Next.js App Router, TypeScript (strict), Tailwind v4.
- **Server Components by default.** Add `"use client"` only when interaction
  requires it.
- Strong typing — domain types live in `src/types`. No `any`.
- Class merging via `cn()` (`src/lib/utils.ts`).
- Reusable primitives in `src/components/ui`. Compose, don't duplicate.

## Component conventions

- Buttons that navigate use `ButtonLink`; never render a dead button. Anything
  not yet wired must be clearly labelled "Coming soon".
- Dialogs/drawers use `Modal` (`src/components/ui/modal.tsx`) — it provides
  focus trap, Escape-to-close, scroll lock, and focus restore.
- Tables use `@tanstack/react-table`; wrap horizontally scrollable tables in
  `.scroll-x` and keep headers accessible.

## Accessibility rules (target WCAG 2.2 AA)

- Semantic HTML and a logical heading order.
- Skip-to-content link is in the root layout.
- Visible focus on every interactive element (global `:focus-visible`).
- Label every form control; show errors with `role="alert"` tied via
  `aria-describedby`.
- Never communicate meaning by colour alone (pair with text/icon).
- Provide text summaries alongside charts.

## Responsive requirements

Test at 360 / 390 / 768 / 1024 / 1280 / 1440. No page-level horizontal scroll.
Sidebar collapses to a drawer; tables scroll inside their own container; search
fields stack; dialogs fit small screens.

## Data-truthfulness rules (important)

- All trade data here is **illustrative**. Every data surface must show an
  "Illustrative demo data" label.
- Never describe data as live, current, real-time, official, verified, or
  100% accurate.
- Do **not** invent business facts: no shipment/country/buyer counts, accuracy
  %, customers, testimonials, awards, partnerships, pricing, offices, employee
  counts, founders, or funding. Use honest placeholders.
- Every AI-style recommendation ("Ask Vasko", Opportunity Score, "Why this
  matters") must show supporting evidence, confidence and a data date.

## Mock data + data access

- All mock data lives in `src/data/mock/`. Keep it centralised there.
- UI must read data **only** through the data-access layer `src/lib/data`.
  Do not import from `src/data/mock` inside components — go through the
  repository so a real API can replace it without touching the UI.
- Keep live integrations separate from presentation code (service/repository
  layer only).

## Logo

- The current logo (`src/components/shared/logo.tsx`, `public/brand/logo.svg`)
  is a **temporary placeholder wordmark**. Replace with the official asset per
  the instructions in that file. Do not redraw, stretch, recolour, or add
  decoration to the approved logo.

## Testing commands

```bash
npm run dev         # local dev server
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit/smoke tests
npm run test:e2e    # Playwright flows (after: npx playwright install)
npm run build       # production build
```

Fix all failures before considering work complete. Run validation after each
major change.

## Future integrations

Auth (Clerk/Auth.js/Supabase), Postgres/Supabase, trade-data API, AI, email,
payments — all plug in behind `src/lib/data` and a future `src/lib/auth`.
Keep the seam clean.
