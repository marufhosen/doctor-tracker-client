"use client";

import { LoaderCircle } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { refreshSessionAction } from "@/actions/auth.actions";
import { requestCoordinatedRefresh } from "@/lib/auth/refresh-client";

export function RefreshCoordinator({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void requestCoordinatedRefresh(refreshSessionAction).then((result) => {
      if (result.success) {
        if (returnTo) router.replace(returnTo as Route);
        else router.refresh();
      } else {
        const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
        router.replace(`/login${next}` as Route);
      }
    });
  }, [returnTo, router]);
  return (
    <main className="grid min-h-svh place-items-center bg-background p-6">
      <output className="flex items-center gap-3 text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary" />
        Restoring your secure session…
      </output>
    </main>
  );
}
