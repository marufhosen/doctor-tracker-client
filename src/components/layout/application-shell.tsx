"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "doctor-tracker:sidebar-collapsed";

type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarState>({ collapsed: false, toggle: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

type ApplicationShellProps = {
  children: ReactNode;
  navigation: ReactNode;
  topbar: ReactNode;
};

export function ApplicationShell({ children, navigation, topbar }: ApplicationShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true");
    } catch {
      // Storage can be unavailable (private mode); keep the expanded default.
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // Persisting the preference is best-effort.
      }
      return next;
    });
  }, []);

  const sidebar = useMemo(() => ({ collapsed, toggle }), [collapsed, toggle]);

  return (
    <SidebarContext.Provider value={sidebar}>
      <div
        className={cn(
          "h-dvh overflow-hidden bg-background lg:grid motion-safe:transition-[grid-template-columns] motion-safe:duration-200",
          collapsed ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]" : "lg:grid-cols-[14rem_minmax(0,1fr)]",
        )}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <aside
          id="application-sidebar"
          aria-label="Application navigation"
          className="scrollbar-custom hidden h-dvh border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block lg:overflow-y-auto"
        >
          {navigation}
        </aside>

        <div className="flex h-dvh min-w-0 flex-col">
          <header className="min-h-16 shrink-0 border-b bg-card px-4 sm:px-6 lg:px-7">
            {topbar}
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="scrollbar-custom min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 lg:px-5 lg:py-4"
          >
            <div className="mx-auto w-full max-w-[72rem]">{children}</div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
