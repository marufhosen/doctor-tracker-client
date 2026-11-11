import "server-only";

import { apiClient } from "@/lib/api/client.server";
import type { AuthCookies } from "@/lib/api/cookies";
import { apiEndpoints } from "@/lib/api/endpoints";
import { userResponseSchema } from "@/lib/api/schemas/auth";
import { readAuthCookiesFromHeaders } from "@/lib/auth/cookies.core";

export type RotatedSession = {
  cookies: AuthCookies;
  headers: Headers;
};

const activeRotations = new Map<string, Promise<RotatedSession | null>>();

async function rotate(cookies: AuthCookies, origin: string): Promise<RotatedSession | null> {
  const refreshToken = cookies.doctor_tracker_refresh;
  const csrfToken = cookies.doctor_tracker_csrf;
  if (!refreshToken || !csrfToken) return null;

  try {
    const response = await apiClient.request({
      path: apiEndpoints.auth.refresh,
      method: "POST",
      cookies,
      headers: { Origin: origin, "X-CSRF-Token": csrfToken },
      responseSchema: userResponseSchema,
    });
    const rotatedCookies = readAuthCookiesFromHeaders(response.headers);
    if (
      response.data.data.user.role !== "ADMIN" ||
      !rotatedCookies.doctor_tracker_access ||
      !rotatedCookies.doctor_tracker_refresh ||
      !rotatedCookies.doctor_tracker_csrf
    ) {
      return null;
    }
    return { cookies: rotatedCookies, headers: response.headers };
  } catch {
    return null;
  }
}

export function rotateAuthSession(
  cookies: AuthCookies,
  origin: string,
): Promise<RotatedSession | null> {
  const refreshToken = cookies.doctor_tracker_refresh;
  if (!refreshToken) return Promise.resolve(null);

  const active = activeRotations.get(refreshToken);
  if (active) return active;

  const rotation = rotate(cookies, origin).finally(() => activeRotations.delete(refreshToken));
  activeRotations.set(refreshToken, rotation);
  return rotation;
}
