"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { getPageContext } from "@/components/layout/page-context";
import { PageBreadcrumbs } from "@/components/layout/page-navigation";

export function TopNavbar({
  navigationControl,
  profileMenu,
}: {
  navigationControl?: ReactNode;
  profileMenu?: ReactNode;
}) {
  const context = getPageContext(usePathname());

  return (
    <div className="flex min-h-16 items-center gap-3 py-1.5">
      {navigationControl}
      {context.parent && (
        <Link
          href={context.parent.href}
          aria-label={`Back to ${context.parent.label}`}
          className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{context.parent.label}</span>
        </Link>
      )}
      <div className="min-w-0">
        <div className="hidden sm:block">
          <PageBreadcrumbs
            items={
              context.parent
                ? [context.parent, { label: context.title }]
                : [{ label: context.eyebrow }, { label: context.title }]
            }
          />
        </div>
      </div>
      <div className="ml-auto hidden items-center gap-2 rounded-lg bg-muted px-4 py-2 text-xs text-muted-foreground sm:flex">
        <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
        Admin portal
      </div>
      <div className="ml-auto flex items-center sm:ml-2">{profileMenu}</div>
    </div>
  );
}
