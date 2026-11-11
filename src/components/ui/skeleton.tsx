import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export function PageSkeleton({ cards = 3, rows = 5 }: { cards?: number; rows?: number }) {
  return (
    <output aria-busy="true" aria-label="Loading page" className="block space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <Skeleton key={`card-${index + 1}`} className="h-32" />
        ))}
      </div>
      <div className="space-y-2.5 rounded-2xl border bg-card p-4">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={`row-${index + 1}`} className="h-14 w-full" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </output>
  );
}
