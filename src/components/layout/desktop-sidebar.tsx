"use client";

import { LockKeyhole, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationItemActive, primaryNavigation } from "@/components/layout/navigation";
import { getInitials } from "@/components/layout/profile-menu.core";
import { cn } from "@/lib/utils";

export function DesktopSidebar({ user }: { user: { name: string; role: "ADMIN" } }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full min-h-svh flex-col px-4 py-5">
      <Link href="/dashboard" className="flex min-h-12 items-center gap-3 px-2 text-foreground">
        <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-primary-foreground">
          <Plus aria-hidden="true" className="size-5" strokeWidth={2.5} />
        </span>
        <span className="font-semibold">Doctor Tracker</span>
      </Link>

      <div className="mt-5 flex items-center gap-3 rounded-xl border bg-muted/50 px-3 py-3 text-foreground">
        <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
        <div>
          <p className="text-xs font-semibold">Care workspace</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Administration</p>
        </div>
      </div>

      <p className="mb-2 mt-8 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Main menu
      </p>
      <nav aria-label="Primary navigation" className="flex-1">
        <ul className="space-y-1">
          {primaryNavigation.map(({ href, label, icon: Icon }) => {
            const active = isNavigationItemActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-xl bg-muted px-3 py-4 text-foreground">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <LockKeyhole aria-hidden="true" className="size-4 text-primary" />
          Secure workspace
        </div>
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
          Doctor and patient records in one protected portal.
        </p>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">
          {getInitials(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
          <p className="text-[11px] text-muted-foreground">Administrator</p>
        </div>
      </div>
    </div>
  );
}
