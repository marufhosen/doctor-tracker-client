import type { AuthCookies } from "@/lib/api/cookies";

interface LogoutDependencies {
  revoke(cookies: AuthCookies, origin: string, csrfToken: string): Promise<void>;
  clear(): Promise<void>;
}

export async function performLogout(
  cookies: AuthCookies,
  origin: string,
  dependencies: LogoutDependencies,
): Promise<void> {
  try {
    if (cookies.doctor_tracker_refresh && cookies.doctor_tracker_csrf) {
      await dependencies.revoke(cookies, origin, cookies.doctor_tracker_csrf);
    }
  } finally {
    await dependencies.clear();
  }
}
