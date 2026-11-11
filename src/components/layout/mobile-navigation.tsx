"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/brand/logo-mark";
import { isNavigationItemActive, primaryNavigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="ghost" size="icon-lg" aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex h-full flex-col px-3 py-4">
            <div className="flex min-h-11 items-center gap-3 px-2 pr-12">
              <span className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <LogoMark className="size-5" />
              </span>
              <div>
                <SheetTitle className="font-semibold">Doctor Tracker</SheetTitle>
                <SheetDescription className="text-xs text-sidebar-foreground/65">
                  Administration
                </SheetDescription>
              </div>
            </div>
            <nav aria-label="Mobile navigation" className="mt-6">
              <ul className="space-y-1">
                {primaryNavigation.map(({ href, label, icon: Icon }) => {
                  const active = isNavigationItemActive(pathname, href);
                  return (
                    <li key={href}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/80 outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                            active && "bg-sidebar-accent text-sidebar-accent-foreground",
                          )}
                        >
                          <Icon aria-hidden="true" className="size-5" />
                          {label}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
