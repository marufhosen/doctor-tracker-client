import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ParsedPatientListQuery } from "@/lib/api/query";
import type { PaginationMeta } from "@/lib/api/schemas/common";
import { cn } from "@/lib/utils";

const pageHref = (query: ParsedPatientListQuery, page: number) => {
  const params = new URLSearchParams();
  const values = {
    search: query.search,
    doctorId: query.doctorId,
    condition: query.condition,
    createdFrom: query.createdFrom?.slice(0, 10),
    createdTo: query.createdTo?.slice(0, 10),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    limit: query.limit === 10 ? undefined : String(query.limit),
    page: page === 1 ? undefined : String(page),
  };
  for (const [key, value] of Object.entries(values)) if (value) params.set(key, value);
  return `/patients${params.size ? `?${params}` : ""}` as Route;
};

export function PatientPagination({
  meta,
  query,
}: {
  meta: PaginationMeta;
  query: ParsedPatientListQuery;
}) {
  if (meta.totalPages === 0)
    return <p className="text-center text-sm text-muted-foreground">No pages to display.</p>;
  const previous = meta.page > 1 ? meta.page - 1 : null;
  const next = meta.page < meta.totalPages ? meta.page + 1 : null;
  const classes =
    "inline-flex min-h-11 items-center gap-1 rounded-lg border bg-card px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <nav aria-label="Patient pagination" className="flex items-center justify-between gap-4">
      {previous ? (
        <Link href={pageHref(query, previous)} rel="prev" className={classes}>
          <ChevronLeft aria-hidden="true" className="size-4" />
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(classes, "opacity-45")}>
          <ChevronLeft aria-hidden="true" className="size-4" />
          Previous
        </span>
      )}
      <p className="text-sm text-muted-foreground">
        Page <strong className="text-foreground">{meta.page}</strong> of {meta.totalPages}
      </p>
      {next ? (
        <Link href={pageHref(query, next)} rel="next" className={classes}>
          Next
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(classes, "opacity-45")}>
          Next
          <ChevronRight aria-hidden="true" className="size-4" />
        </span>
      )}
    </nav>
  );
}
