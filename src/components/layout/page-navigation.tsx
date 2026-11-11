import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: Route;
};

export function PageBreadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />}
              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="truncate rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn("truncate", current && "font-medium text-foreground")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  breadcrumbs?: readonly BreadcrumbItem[];
  actions?: ReactNode;
  kind?: "list" | "detail" | "form";
};

export function PageHeader({
  title,
  eyebrow,
  description,
  breadcrumbs,
  actions,
  kind = "list",
}: PageHeaderProps) {
  return (
    <header data-page-kind={kind} className="mb-5 space-y-2">
      {breadcrumbs && breadcrumbs.length > 0 && <PageBreadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl sm:text-[2rem]">{title}</h1>
          {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
