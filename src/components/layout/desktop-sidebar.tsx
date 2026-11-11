"use client";

import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/brand/logo-mark";
import { useSidebar } from "@/components/layout/application-shell";
import { isNavigationItemActive, primaryNavigation } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <div className={cn("flex min-h-full flex-col py-4", collapsed ? "px-2" : "px-3")}>
      <div className={cn("flex items-center", collapsed ? "justify-center" : "px-2")}>
        <Link
          href="/dashboard"
          aria-label="Doctor Tracker dashboard"
          className="flex min-h-11 items-center gap-3 rounded-lg text-foreground"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground">
            <LogoMark className="size-5" />
          </span>
          {!collapsed && <span className="font-semibold">Doctor Tracker</span>}
        </Link>
      </div>

      {!collapsed && (
        <p className="mb-1.5 mt-5 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Main menu
        </p>
      )}

      <nav aria-label="Primary navigation" className={cn("flex-1", collapsed && "mt-4")}>
        <ul className="space-y-1">
          {primaryNavigation.map(({ href, label, icon: Icon }) => {
            const active = isNavigationItemActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    collapsed && "justify-center px-0",
                    active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        title={collapsed ? "Clinical workspace" : undefined}
        className={cn(
          "mt-4 rounded-[10px] border border-sidebar-border bg-sidebar-accent/50",
          collapsed ? "p-2" : "p-3",
        )}
      >
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Stethoscope aria-hidden="true" className="size-4" />
          </span>
          {!collapsed && (
            <p className="text-xs font-semibold text-sidebar-foreground">Clinical workspace</p>
          )}
        </div>
        {!collapsed && (
          <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
            Doctors, patients, and their care assignments in one place.
          </p>
        )}
      </div>
    </div>
  );
}
