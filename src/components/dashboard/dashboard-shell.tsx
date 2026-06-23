"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  ChevronLeft,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Search,
  User,
  X,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { dashboardNav } from "@/config/site";
import { navIcons } from "@/components/dashboard/nav-icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar (desktop) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-background transition-[width] lg:flex",
          collapsed ? "w-[68px]" : "w-60",
        )}
      >
        <div className="flex h-14 items-center border-b border-border px-3">
          {collapsed ? (
            <Link href="/dashboard" aria-label="Vaskodigama dashboard" className="mx-auto text-primary">
              <LogoMark className="size-7" />
            </Link>
          ) : (
            <Logo href="/dashboard" />
          )}
        </div>
        <SidebarNav pathname={pathname} collapsed={collapsed} />
        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted hover:bg-surface"
          >
            {collapsed ? <PanelLeft className="size-5" aria-hidden /> : <PanelLeftClose className="size-5" aria-hidden />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-background shadow-lg">
            <div className="flex h-14 items-center justify-between border-b border-border px-3">
              <Logo href="/dashboard" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-muted hover:bg-surface"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              <SidebarNav pathname={pathname} collapsed={false} />
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className={cn("flex min-h-screen flex-col transition-[padding]", collapsed ? "lg:pl-[68px]" : "lg:pl-60")}>
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  collapsed,
}: {
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <nav aria-label="Dashboard" className="flex-1 overflow-y-auto p-2">
      <ul className="space-y-0.5">
        {dashboardNav.map((item) => {
          const Icon = navIcons[item.icon] ?? Search;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium",
                  active
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "text-muted-strong hover:bg-surface hover:text-navy",
                  collapsed && "justify-center",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const router = useRouter();
  const [term, setTerm] = React.useState("");
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="rounded-md p-1.5 text-navy hover:bg-surface lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <form
        className="relative max-w-md flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams();
          if (term.trim()) params.set("term", term.trim());
          router.push(`/dashboard/search?${params.toString()}`);
        }}
      >
        <label htmlFor="topbar-search" className="sr-only">
          Quick trade search
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input
          id="topbar-search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search products, HS codes, markets…"
          className="h-9 pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/dashboard/alerts"
          aria-label="Alerts"
          className="relative rounded-md p-2 text-muted hover:bg-surface hover:text-navy"
        >
          <Bell className="size-5" aria-hidden />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" aria-hidden />
        </Link>
        <Link
          href="/dashboard/saved"
          aria-label="Saved items"
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-navy"
        >
          <Bookmark className="size-5" aria-hidden />
        </Link>
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-md p-1 pl-2 hover:bg-surface"
          >
            <span className="hidden text-sm font-medium text-navy sm:inline">Demo user</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
              <User className="size-4" aria-hidden />
            </span>
          </button>
          {profileOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-background p-1.5 shadow-md"
            >
              <p className="px-2.5 py-1.5 text-xs text-muted">Signed in (demo)</p>
              <MenuLink href="/dashboard/settings">Settings</MenuLink>
              <MenuLink href="/dashboard/subscription">Subscription</MenuLink>
              <MenuLink href="/">Back to site</MenuLink>
              <MenuLink href="/login">Sign out</MenuLink>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block rounded-md px-2.5 py-1.5 text-sm text-muted-strong hover:bg-surface hover:text-navy"
    >
      {children}
    </Link>
  );
}

/** Small back-to-overview link for nested dashboard pages. */
export function DashboardBack() {
  return (
    <Link
      href="/dashboard"
      className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
    >
      <ChevronLeft className="size-4" aria-hidden /> Overview
    </Link>
  );
}
