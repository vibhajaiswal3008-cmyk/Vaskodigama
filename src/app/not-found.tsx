import { Compass, Home, Search } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <Logo />
      <Compass className="mt-10 size-12 text-primary" aria-hidden />
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-1 text-3xl font-bold text-navy">
        We couldn’t chart that page
      </h1>
      <p className="mt-2 max-w-md text-muted">
        The page you’re looking for doesn’t exist or may have moved. Let’s get
        you back on course.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">
          <Home className="size-4" aria-hidden /> Back to home
        </ButtonLink>
        <ButtonLink href="/demo" variant="outline">
          <Search className="size-4" aria-hidden /> Explore the demo
        </ButtonLink>
      </div>
    </main>
  );
}
