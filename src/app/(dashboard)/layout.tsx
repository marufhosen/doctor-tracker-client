import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RefreshCoordinator } from "@/components/auth/refresh-coordinator";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { getProtectedRouteDecision } from "@/lib/auth/protected.core";
import { getSession } from "@/lib/auth/session.server";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={null}>
      <ProtectedContent>{children}</ProtectedContent>
    </Suspense>
  );
}

async function ProtectedContent({ children }: { children: React.ReactNode }) {
  const decision = getProtectedRouteDecision(await getSession());
  if (decision === "login") {
    if ((await getAuthCookies()).doctor_tracker_refresh) return <RefreshCoordinator />;
    redirect("/login?next=/dashboard");
  }
  if (decision === "forbidden") redirect("/login?reason=forbidden");
  if (decision === "unavailable") throw new Error("Authentication service unavailable");
  return children;
}
