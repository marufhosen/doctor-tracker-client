import { redirect } from "next/navigation";

import { getProtectedRouteDecision } from "@/lib/auth/protected.core";
import { getSession } from "@/lib/auth/session.server";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const decision = getProtectedRouteDecision(await getSession());
  if (decision === "login") redirect("/login?next=/dashboard");
  if (decision === "forbidden") redirect("/login?reason=forbidden");
  if (decision === "unavailable") throw new Error("Authentication service unavailable");
  return children;
}
