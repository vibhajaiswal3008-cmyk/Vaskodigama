import { IllustrativeBadge } from "@/components/shared/illustrative";

/** Consistent header for dashboard pages. */
export function DashboardPageHeader({
  title,
  description,
  actions,
  showIllustrative = true,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showIllustrative?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {showIllustrative ? <IllustrativeBadge /> : null}
      </div>
    </div>
  );
}
