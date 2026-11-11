import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { ParsedDoctorListQuery } from "@/lib/api/query";
import type { PaginationMeta } from "@/lib/api/schemas/common";
import { cn } from "@/lib/utils";

const hrefForPage = (query: ParsedDoctorListQuery, page: number) => {
  const parameters = new URLSearchParams();
  const values = {
    search: query.search,
    specialization: query.specialization,
    hospital: query.hospital,
    createdFrom: query.createdFrom?.slice(0, 10),
    createdTo: query.createdTo?.slice(0, 10),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    limit: query.limit === 10 ? undefined : String(query.limit),
    page: page === 1 ? undefined : String(page),
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) parameters.set(key, value);
  }
  return `/doctors${parameters.size ? `?${parameters}` : ""}` as Route;
};

export function DoctorPagination({
  meta,
  query,
}: {
  meta: PaginationMeta;
  query: ParsedDoctorListQuery;
}) {
  if (meta.totalPages === 0) {
    return <p className="text-center text-sm text-muted-foreground">No pages to display.</p>;
  }

  const previous = meta.page > 1 ? meta.page - 1 : null;
  const next = meta.page < meta.totalPages ? meta.page + 1 : null;
  const controlClass =
    "inline-flex min-h-11 items-center gap-1 rounded-lg border bg-card px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <nav aria-label="Doctor pagination" className="flex items-center justify-between gap-4">
      {previous ? (
        <Link href={hrefForPage(query, previous)} rel="prev" className={controlClass}>
          <ChevronLeft aria-hidden="true" className="size-4" /> Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(controlClass, "cursor-not-allowed opacity-45")}>
          <ChevronLeft aria-hidden="true" className="size-4" /> Previous
        </span>
      )}
      <p className="text-center text-sm text-muted-foreground">
        Page <strong className="text-foreground">{meta.page}</strong> of {meta.totalPages}
      </p>
      {next ? (
        <Link href={hrefForPage(query, next)} rel="next" className={controlClass}>
          Next <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(controlClass, "cursor-not-allowed opacity-45")}>
          Next <ChevronRight aria-hidden="true" className="size-4" />
        </span>
      )}
    </nav>
  );
}
