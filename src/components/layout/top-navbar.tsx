"use client";

import { ShieldCheck } from "lucide-react";
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
    <div className="flex min-h-20 items-center gap-3 py-2">
      {navigationControl}
      <div className="min-w-0">
        <div className="hidden sm:block">
          <PageBreadcrumbs items={[{ label: context.eyebrow }, { label: context.title }]} />
        </div>
      </div>
      <div className="ml-auto hidden items-center gap-2 rounded-lg bg-muted px-4 py-2 text-xs text-muted-foreground sm:flex">
        <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
        Admin portal
      </div>
      <div className="ml-2 flex items-center">{profileMenu}</div>
    </div>
  );
}
