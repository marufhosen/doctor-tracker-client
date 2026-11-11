"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { getPageContext } from "@/components/layout/page-context";

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
        <p className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:block">
          {context.eyebrow}
        </p>
        <h1 className="truncate text-lg leading-tight sm:text-xl">{context.title}</h1>
      </div>
      <div className="ml-auto flex items-center">{profileMenu}</div>
    </div>
  );
}
