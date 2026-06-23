import * as React from "react";
import { cn } from "@/lib/utils";

/** Loading skeleton block. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-surface-2", className)}
      {...props}
    />
  );
}

/** Accessible checkbox with label. */
export function Checkbox({
  label,
  id,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  const generated = React.useId();
  const inputId = id ?? generated;
  return (
    <label
      htmlFor={inputId}
      className={cn("flex items-start gap-2.5 text-sm text-muted-strong", className)}
    >
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 rounded border-border-strong text-primary accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

/** Section eyebrow label. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
      {children}
    </p>
  );
}

/** Empty-state block with helpful guidance. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-muted">{icon}</div> : null}
      <p className="font-semibold text-navy">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Consistent page-section wrapper for marketing pages. */
export function Section({
  className,
  muted,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { muted?: boolean }) {
  return (
    <section
      className={cn(muted && "bg-surface", "py-16 sm:py-20", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
