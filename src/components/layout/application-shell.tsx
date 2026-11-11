import type { ReactNode } from "react";

type ApplicationShellProps = {
  children: ReactNode;
  navigation: ReactNode;
  topbar: ReactNode;
};

export function ApplicationShell({ children, navigation, topbar }: ApplicationShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-background lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <aside
        aria-label="Application navigation"
        className="hidden h-dvh border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block lg:overflow-y-auto"
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
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:px-7 lg:py-6"
        >
          <div className="mx-auto w-full max-w-[72rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
