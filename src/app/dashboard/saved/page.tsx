import Link from "next/link";
import { Bookmark, Building2, Factory, Globe, Box, Search } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { tradeData } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { SavedItem } from "@/types";

const kindIcon: Record<string, typeof Bookmark> = {
  search: Search,
  company: Building2,
  supplier: Factory,
  market: Globe,
  product: Box,
};

export default async function SavedPage() {
  const items = (await tradeData.listSavedItems()) as SavedItem[];
  return (
    <>
      <DashboardPageHeader
        title="Saved"
        description="Your saved searches, companies, suppliers, markets and products."
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="size-6" />}
          title="Nothing saved yet"
          description="Save a search, company or market and it will appear here."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = kindIcon[item.kind] ?? Bookmark;
            return (
              <Link key={item.id} href={item.href}>
                <Card className="h-full transition-colors hover:border-primary">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between">
                      <Icon className="size-5 text-primary" aria-hidden />
                      <Badge tone="neutral" className="capitalize">
                        {item.kind}
                      </Badge>
                    </div>
                    <h2 className="mt-3 font-semibold text-navy">{item.label}</h2>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                    <p className="mt-3 text-xs text-muted">Saved {formatDate(item.savedAt)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
