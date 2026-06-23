# Vaskodigama

**Trade data that tells you what to do next.**

Vaskodigama is a global trade-intelligence web application: a public marketing
site plus an authenticated-style application dashboard. It helps exporters,
importers and analysts **discover** markets, **understand** trade movement,
**compare** buyers and suppliers, **decide** with an Opportunity Score, and
**connect** through saved opportunities, alerts and reports.

> ⚠️ **Demonstration build.** All trade data, companies, buyers, suppliers,
> shipments, prices and scores are **illustrative and fictional**. Nothing here
> is connected to a live customs feed, real authentication, payments, or an AI
> API. Every data surface is labelled “Illustrative demo data”.

---

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **Recharts** (charts) · **TanStack Table** (data tables)
- **React Hook Form** + **Zod** (forms & validation)
- **lucide-react** (icons) · **framer-motion** (restrained motion)
- **next/font** (Manrope headings, Inter body)
- **Vitest** + **Testing Library** (unit/smoke) · **Playwright** (e2e)

## Getting started

> Requires Node.js 20+ (built and tested on Node 24). If Node isn’t installed,
> install the LTS first (e.g. `winget install OpenJS.NodeJS.LTS`).

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build → static HTML export in `out/` |
| `npm run serve` | Serve the exported `out/` folder (default http://localhost:4173) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit/smoke tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright e2e (`npx playwright install` once first) |

## Routes

**Public** — `/`, `/platform`, `/solutions/{exporters,importers,market-research,procurement}`,
`/industries`, `/data`, `/demo`, `/resources`, `/about`, `/contact`,
`/login`, `/register`, `/privacy`, `/terms`, custom `not-found`,
plus `/sitemap.xml` and `/robots.txt`.

**Application (demo)** — `/dashboard`, `/dashboard/{search,markets,buyers,suppliers,
shipments,companies,compare,alerts,reports,saved,ask-vasko,settings,subscription}`.

## Folder structure

```
src/
  app/
    (marketing)/      # public site + shared header/footer layout
    (auth)/           # login & register (demo)
    dashboard/        # authenticated-style app + shell layout
    sitemap.ts, robots.ts, not-found.tsx, layout.tsx, globals.css
  components/
    ui/               # primitives (button, card, input, modal, tabs, tooltip…)
    layout/           # header, footer, announcement strip
    search/           # Global Trade Search, combobox, results
    charts/ tables/   # Recharts wrappers, TanStack table + column factories
    opportunity/ company/ market/ compare/ monitoring/ reports/ ask-vasko/
    dashboard/        # app shell + per-page explorers
    forms/ marketing/ shared/
  data/mock/          # ALL illustrative data lives here
  lib/
    data/             # data-access layer (the seam to a real API)
    search/           # query summary + URL param helpers
    utils.ts, validation.ts
  hooks/ types/ config/
public/brand/         # logo placeholder + favicon
e2e/                  # Playwright specs
```

## Design system

Tokens live in `src/app/globals.css` under `@theme` (colours, radius, shadows,
fonts). Use semantic utilities (`bg-primary`, `text-navy`, `border-border`,
`text-muted`, `chart-1..6`) — **don’t hardcode hex** in components. Blue-led,
calm, generous whitespace, subtle shadows, restrained motion that respects
`prefers-reduced-motion`. See `CLAUDE.md` for the full rules.

## Logo replacement

The current logo is a **temporary placeholder wordmark** (a compass mark).
To use the official asset:

1. Drop the SVG into `public/brand/logo.svg`.
2. In `src/components/shared/logo.tsx`, replace the inline `<svg>` mark with the
   official artwork (or an `<Image src="/brand/logo.svg" …>`).
3. Update `public/favicon.svg` to match.
4. Do **not** redraw, stretch, recolour or decorate the approved logo.

## Mock data & the data-access layer

- All illustrative data is centralised in **`src/data/mock/`** (countries,
  subregions, ports, HS codes, products, companies, markets, shipments,
  prices, alerts/saved/change-feed, Ask Vasko responses).
- UI components read data **only** through **`src/lib/data`** (`tradeData.*` and
  `buildSearchResult`). This is the single seam between the app and its data.

### Replacing mock data with a real API

1. Keep the function signatures in `src/lib/data/index.ts`; change the bodies to
   `fetch` your trade-data API and map responses into the existing types in
   `src/types`.
2. The return types stay the same, so **no UI component needs to change.**
3. `buildSearchResult(query)` is where a real “run search” call would live.

### Product / HS-code / country/state data shapes

See `src/types/index.ts` — `Product` (with `aliases` + `suggestedHsCodes`),
`HsCode` (level, parent, related terms, `variesByCountry`), `Country`
(`hasStateData` gates subnational UI), `SubRegion`, `Port`.

## Integration plans (future)

- **Authentication** — add `src/lib/auth`; swap the demo login/register
  (`src/components/forms/*`) for Clerk / Auth.js / Supabase. Gate `/dashboard`
  with middleware.
- **Database** — Postgres/Supabase behind `src/lib/data`. Replace mock reads
  with queries; keep the repository interface.
- **Trade-data API / customs feeds** — implement inside `src/lib/data`.
- **Email** — wire the contact/demo form handler (`demo-request-form.tsx`) to a
  provider; today it only shows a success state.
- **AI (Ask Vasko)** — replace `matchAskVasko` (`src/data/mock/askVasko.ts`)
  with a real model call; keep showing evidence + confidence + data date.
- **Payments / subscription** — connect a provider on `/dashboard/subscription`
  (no prices are shown today, by design).

## Static HTML export

The app is configured for static export (`output: "export"` in
`next.config.ts`), so `npm run build` writes a fully browsable site to **`out/`**
(one `index.html` per route). Open it locally with the bundled static server:

```bash
npm run build      # generates out/
npm run serve      # http://localhost:4173
```

Note: open it through `npm run serve` (or any static host), not by
double-clicking the files — Next uses absolute asset paths (`/_next/…`) that
don’t resolve under `file://`. The `out/` folder can be dropped onto any static
host (Netlify, GitHub Pages, S3, Vercel) as-is.

## Deployment

Deploy the exported `out/` folder to any static host, or build on the platform:

```bash
npm run build      # produces out/
# deploy ./out
```

Set `siteConfig.url` (`src/config/site.ts`) to the production domain so
metadata, Open Graph, sitemap and robots use the right canonical URL.

## Accessibility

Targets WCAG 2.2 AA: semantic HTML, skip-to-content link, visible focus,
labelled forms with `role="alert"` errors, focus-trapped dialogs, accessible
tables, text summaries alongside charts, no colour-only meaning, and global
reduced-motion support.

## Known limitations

- Illustrative data only; not connected to live customs sources.
- Demo auth/registration/subscription — no real accounts, sessions or billing.
- Ask Vasko uses pre-written local responses (no AI API).
- Forms validate and show success states but do not send email.
- Subnational (state) coverage is included for a few countries as an example.

## Recommended next phase

1. Real authentication + `/dashboard` route protection.
2. Connect a trade-data API behind `src/lib/data`.
3. Persistence for saved items, alerts and reports (DB + user accounts).
4. Server-side search/filtering and pagination at scale.
5. Email + scheduled alert delivery; real AI for Ask Vasko with citations.
```
