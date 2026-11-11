import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import type { PaginationMeta } from "@/lib/api/schemas/common";
import { cn } from "@/lib/utils";

const controlClass =
  "inline-flex h-9 items-center gap-1 rounded-lg border bg-card px-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const pageClass =
  "grid size-9 place-items-center rounded-lg border bg-card text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type PageItem = { key: string; page: number | null };

function pageWindow(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      key: `page-${index + 1}`,
      page: index + 1,
    }));
  }
  const start = Math.max(2, Math.min(page - 1, totalPages - 3));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 4));
  const items: PageItem[] = [{ key: "page-1", page: 1 }];
  if (start > 2) items.push({ key: `gap-${start}`, page: null });
  for (let value = start; value <= end; value += 1)
    items.push({ key: `page-${value}`, page: value });
  if (end < totalPages - 1) items.push({ key: `gap-${end}`, page: null });
  items.push({ key: `page-${totalPages}`, page: totalPages });
  return items;
}

export function ListPagination({
  meta,
  label,
  pageHref,
}: {
  meta: PaginationMeta;
  label: string;
  pageHref: (page: number) => Route;
}) {
  if (meta.totalPages === 0) {
    return (
      <p className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
        No pages to display.
      </p>
    );
  }

  const previous = meta.page > 1 ? meta.page - 1 : null;
  const next = meta.page < meta.totalPages ? meta.page + 1 : null;

  return (
    <nav
      aria-label={label}
      className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-xs text-muted-foreground sm:text-sm">
        Page <strong className="font-semibold text-foreground">{meta.page}</strong> of{" "}
        {meta.totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        {previous ? (
          <Link href={pageHref(previous)} rel="prev" className={controlClass}>
            <ChevronLeft aria-hidden="true" className="size-4" />
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" className={cn(controlClass, "cursor-not-allowed opacity-45")}>
            <ChevronLeft aria-hidden="true" className="size-4" />
            Previous
          </span>
        )}
        <ol className="flex items-center gap-1">
          {pageWindow(meta.page, meta.totalPages).map((item) =>
            item.page === null ? (
              <li key={item.key} aria-hidden="true" className="px-0.5 text-sm">
                …
              </li>
            ) : (
              <li key={item.key}>
                <Link
                  href={pageHref(item.page)}
                  aria-label={`Page ${item.page}`}
                  aria-current={item.page === meta.page ? "page" : undefined}
                  className={cn(
                    pageClass,
                    item.page === meta.page &&
                      "border-primary bg-primary text-primary-foreground hover:bg-primary",
                  )}
                >
                  {item.page}
                </Link>
              </li>
            ),
          )}
        </ol>
        {next ? (
          <Link href={pageHref(next)} rel="next" className={controlClass}>
            Next
            <ChevronRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span aria-disabled="true" className={cn(controlClass, "cursor-not-allowed opacity-45")}>
            Next
            <ChevronRight aria-hidden="true" className="size-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
