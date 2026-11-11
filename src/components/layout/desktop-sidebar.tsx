"use client";

import { HeartPulse, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { isNavigationItemActive, primaryNavigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const toggleLabel = collapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <div
      data-collapsed={collapsed}
      className="flex h-full min-h-svh flex-col overflow-hidden px-3 py-4"
    >
      <div
        className={cn("flex min-h-11 items-center gap-3 px-2", collapsed && "justify-center px-0")}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <HeartPulse aria-hidden="true" className="size-5" />
        </span>
        <span className={cn("whitespace-nowrap font-semibold", collapsed && "sr-only")}>
          Doctor Tracker
        </span>
      </div>

      <nav aria-label="Primary navigation" className="mt-8 flex-1">
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
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active && "bg-sidebar-accent text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  <span className={cn("whitespace-nowrap", collapsed && "sr-only")}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={toggleLabel}
        title={toggleLabel}
        className={cn(
          "min-h-11 justify-start gap-3 px-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        <span className={cn("whitespace-nowrap", collapsed && "sr-only")}>{toggleLabel}</span>
      </Button>
    </div>
  );
}
