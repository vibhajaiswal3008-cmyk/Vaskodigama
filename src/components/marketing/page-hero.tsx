/** Consistent, light hero band for interior marketing pages.
 *
 * Light "ice" surface with a faint blue route grid and a gradient-accented
 * eyebrow. Same props as before, so every page that uses it updates
 * automatically. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="surface-hero-light relative overflow-hidden border-b border-border">
      <div className="bg-route-grid-light absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-soft-foreground">
            {eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>
          ) : null}
          {children ? <div className="mt-7 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
