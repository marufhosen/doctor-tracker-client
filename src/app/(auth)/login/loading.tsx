import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <output
        aria-busy="true"
        aria-label="Loading sign in"
        className="block w-full max-w-md space-y-5 rounded-2xl border bg-card p-6"
      >
        <Skeleton className="mx-auto size-12 rounded-xl" />
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <span className="sr-only">Loading…</span>
      </output>
    </main>
  );
}
