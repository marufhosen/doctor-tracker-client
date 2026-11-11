import type { AuthCookies } from "@/lib/api/cookies";
import { normalizeApiClientError } from "@/lib/api/errors";
import type { User } from "@/lib/api/schemas/auth";

export type SessionState =
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" }
  | { status: "unavailable" };

export async function resolveSession(
  cookies: AuthCookies,
  fetchUser: (cookies: AuthCookies) => Promise<User>,
): Promise<SessionState> {
  if (!cookies.doctor_tracker_access) return { status: "unauthenticated" };

  try {
    return { status: "authenticated", user: await fetchUser(cookies) };
  } catch (error) {
    const normalized = normalizeApiClientError(error);
    if (normalized.kind === "unauthenticated") return { status: "unauthenticated" };
    return { status: "unavailable" };
  }
}
