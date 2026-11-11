"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ApplicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application route failed", error);
  }, [error]);
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <section
        aria-labelledby="error-title"
        className="max-w-lg rounded-2xl border bg-card p-8 text-center shadow-card"
      >
        <AlertTriangle aria-hidden="true" className="mx-auto size-10 text-destructive" />
        <h1 id="error-title" className="mt-4 text-2xl">
          We couldn’t load this page
        </h1>
        <p className="mt-2 text-muted-foreground">
          The service may be temporarily unavailable. No technical details or account data have been
          exposed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
