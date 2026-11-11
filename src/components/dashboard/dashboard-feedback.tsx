import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardSectionError({ title }: { title: string }) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-destructive/25 bg-card p-5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <h2 className="text-base">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This section could not be loaded. Other dashboard data remains available.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/dashboard">Try again</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DashboardSectionSkeleton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      aria-busy="true"
      className={cn(
        "min-h-40 animate-pulse rounded-2xl border bg-card p-5 shadow-card motion-reduce:animate-none",
        className,
      )}
    >
      <span className="sr-only">Loading…</span>
      <div className="h-5 w-40 rounded bg-muted" />
      <div className="mt-3 h-4 w-64 max-w-full rounded bg-muted" />
      <div className="mt-6 h-24 rounded-xl bg-muted" />
    </section>
  );
}
