import { Eyebrow } from "@/components/ui/misc";

/** Consistent hero band for interior marketing pages. */
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
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-3 text-lg text-muted">{subtitle}</p>
          ) : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
