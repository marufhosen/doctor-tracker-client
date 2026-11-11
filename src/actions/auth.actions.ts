"use server";

import { type LoginActionResult, performLogin } from "@/actions/auth.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { LoginInput } from "@/lib/api/schemas/auth";
import { userResponseSchema } from "@/lib/api/schemas/auth";
import {
  clearMirroredAuthCookies,
  getAuthCookies,
  synchronizeAuthCookies,
} from "@/lib/auth/cookies.server";
import { getTrustedRequestOrigin } from "@/lib/auth/origin.server";

export async function loginAction(input: unknown): Promise<LoginActionResult> {
  try {
    const origin = await getTrustedRequestOrigin();
    return performLogin(input, origin, {
      login: async (credentials: LoginInput, trustedOrigin: string) => {
        const response = await apiClient.request({
          path: apiEndpoints.auth.login,
          method: "POST",
          body: credentials,
          headers: { Origin: trustedOrigin },
          responseSchema: userResponseSchema,
        });
        return { user: response.data.data.user, headers: response.headers };
      },
      synchronizeCookies: synchronizeAuthCookies,
    });
  } catch {
    return {
      success: false,
      error: { kind: "unknown", message: "Unable to sign in. Please try again." },
    };
  }
}

export async function refreshSessionAction(): Promise<{ success: boolean }> {
  try {
    const authCookies = await getAuthCookies();
    const csrfToken = authCookies.doctor_tracker_csrf;
    if (!authCookies.doctor_tracker_refresh || !csrfToken) {
      await clearMirroredAuthCookies();
      return { success: false };
    }
    const response = await apiClient.request({
      path: apiEndpoints.auth.refresh,
      method: "POST",
      cookies: authCookies,
      headers: { Origin: await getTrustedRequestOrigin(), "X-CSRF-Token": csrfToken },
      responseSchema: userResponseSchema,
    });
    if (response.data.data.user.role !== "ADMIN") {
      await clearMirroredAuthCookies();
      return { success: false };
    }
    if ((await synchronizeAuthCookies(response.headers)) !== 3)
      throw new Error("Rotation incomplete");
    return { success: true };
  } catch {
    await clearMirroredAuthCookies();
    return { success: false };
  }
}
