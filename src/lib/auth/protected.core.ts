import type { SessionState } from "@/lib/auth/session.core";

export type ProtectedRouteDecision = "allow" | "login" | "forbidden" | "unavailable";

export function getProtectedRouteDecision(session: SessionState): ProtectedRouteDecision {
  if (session.status === "unauthenticated") return "login";
  if (session.status === "unavailable") return "unavailable";
  return session.user.role === "ADMIN" ? "allow" : "forbidden";
}
