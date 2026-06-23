/** Shared typographic wrapper for legal pages (no external prose plugin). */
export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-muted [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_strong]:text-navy [&_p]:leading-relaxed">
      {children}
    </div>
  );
}
