"use client";

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
    <div className="flex min-h-16 items-center gap-3 py-2">
      {navigationControl}
      <div className="min-w-0">
        <div className="hidden sm:block">
          <PageBreadcrumbs items={[{ label: context.eyebrow }, { label: context.title }]} />
        </div>
        <h1 className="truncate text-lg leading-tight sm:text-xl">{context.title}</h1>
      </div>
      <div className="ml-auto flex items-center">{profileMenu}</div>
    </div>
  );
}
