import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-6 sm:px-6 md:py-8">
      <output
        aria-busy="true"
        aria-label="Loading sign in"
        className="grid w-full max-w-[60rem] overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[0_28px_70px_-32px_rgba(40,35,63,0.4)] md:h-[min(42rem,calc(100svh-4rem))] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div className="hidden bg-muted md:block" />
        <div className="flex min-h-0 flex-col px-6 py-8 sm:px-10 lg:px-12">
          <div className="mx-auto my-auto w-full max-w-[23rem] space-y-4">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-8 w-28" />
            <div className="space-y-4">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </output>
    </main>
  );
}
