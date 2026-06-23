/**
 * Central site configuration. Keep all brand-level copy and navigation here so
 * it stays consistent across the marketing site and the application shell.
 *
 * IMPORTANT (data-truthfulness): do not add invented business facts here —
 * no office addresses, phone numbers, customer names, social profiles, or
 * statistics. Only honest, verifiable information.
 */

export const siteConfig = {
  name: "Vaskodigama",
  tagline: "Trade data that tells you what to do next",
  description:
    "Search products, HS codes and markets. Discover suitable buyers and suppliers, understand trade movement, and turn complex shipment records into clear business decisions.",
  // Placeholder canonical URL — replace with the real production domain.
  url: "https://vaskodigama.example.com",
  // Honest contact placeholder — no fabricated phone/address.
  contactEmail: "hello@vaskodigama.example.com",
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

/** Primary marketing navigation. */
export const mainNav: NavItem[] = [
  {
    label: "Platform",
    href: "/platform",
    description: "How Vaskodigama turns shipment records into decisions.",
  },
  {
    label: "Solutions",
    href: "/solutions/exporters",
    description: "Tailored workflows by role.",
    children: [
      {
        label: "For exporters",
        href: "/solutions/exporters",
        description: "Find active buyers and growing markets.",
      },
      {
        label: "For importers",
        href: "/solutions/importers",
        description: "Discover dependable suppliers and compare prices.",
      },
      {
        label: "Market research",
        href: "/solutions/market-research",
        description: "Size demand and spot momentum early.",
      },
      {
        label: "Procurement",
        href: "/solutions/procurement",
        description: "Shortlist and evaluate suppliers with evidence.",
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Analytical workspaces per sector.",
  },
  {
    label: "Data",
    href: "/data",
    description: "What stands behind every insight.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Guides for first-time exporters and analysts.",
  },
  {
    label: "About",
    href: "/about",
    description: "Why we built Vaskodigama.",
  },
];

/** Footer link groups. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Overview", href: "/platform" },
      { label: "Global Trade Search", href: "/platform#search" },
      { label: "Opportunity Score", href: "/platform#opportunity-score" },
      { label: "Explore demo", href: "/demo" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { label: "For exporters", href: "/solutions/exporters" },
      { label: "For importers", href: "/solutions/importers" },
      { label: "Market research", href: "/solutions/market-research" },
      { label: "Procurement", href: "/solutions/procurement" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Industries", href: "/industries" },
      { label: "Data transparency", href: "/data" },
      { label: "Resources", href: "/resources" },
      { label: "Request a demo", href: "/demo" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

/** Authenticated application navigation (demo). */
export const dashboardNav: { label: string; href: string; icon: string }[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Trade Analytics", href: "/dashboard/analytics", icon: "ChartColumnBig" },
  { label: "Search", href: "/dashboard/search", icon: "Search" },
  { label: "Markets", href: "/dashboard/markets", icon: "Globe" },
  { label: "Buyers", href: "/dashboard/buyers", icon: "ShoppingCart" },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: "Factory" },
  { label: "Shipments", href: "/dashboard/shipments", icon: "Ship" },
  { label: "Companies", href: "/dashboard/companies", icon: "Building2" },
  { label: "Compare", href: "/dashboard/compare", icon: "GitCompareArrows" },
  { label: "Alerts", href: "/dashboard/alerts", icon: "Bell" },
  { label: "Reports", href: "/dashboard/reports", icon: "FileText" },
  { label: "Saved", href: "/dashboard/saved", icon: "Bookmark" },
  { label: "Ask Vasko", href: "/dashboard/ask-vasko", icon: "Sparkles" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];
