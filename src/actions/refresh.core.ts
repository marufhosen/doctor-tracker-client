import type { AuthCookies } from "@/lib/api/cookies";
import type { User } from "@/lib/api/schemas/auth";

interface RefreshDependencies {
  rotate(
    cookies: AuthCookies,
    origin: string,
    csrfToken: string,
  ): Promise<{ user: User; headers: Headers }>;
  synchronize(headers: Headers): Promise<number>;
  clear(): Promise<void>;
}

export async function performRefresh(
  cookies: AuthCookies,
  origin: string,
  dependencies: RefreshDependencies,
): Promise<{ success: boolean }> {
  const csrfToken = cookies.doctor_tracker_csrf;
  if (!cookies.doctor_tracker_refresh || !csrfToken) {
    await dependencies.clear();
    return { success: false };
  }
  try {
    const response = await dependencies.rotate(cookies, origin, csrfToken);
    if (
      response.user.role !== "ADMIN" ||
      (await dependencies.synchronize(response.headers)) !== 3
    ) {
      await dependencies.clear();
      return { success: false };
    }
    return { success: true };
  } catch {
    await dependencies.clear();
    return { success: false };
  }
}
