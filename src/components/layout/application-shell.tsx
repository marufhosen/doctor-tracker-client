import type { ReactNode } from "react";

type ApplicationShellProps = {
  children: ReactNode;
  navigation: ReactNode;
  topbar: ReactNode;
};

export function ApplicationShell({ children, navigation, topbar }: ApplicationShellProps) {
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <aside
        aria-label="Application navigation"
        className="hidden min-h-svh border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block"
      >
        {navigation}
      </aside>

      <div className="flex min-h-svh min-w-0 flex-col">
        <header className="min-h-16 border-b bg-card px-4 sm:px-6 lg:px-8">{topbar}</header>
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
