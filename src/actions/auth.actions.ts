"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type LoginActionResult, performLogin } from "@/actions/auth.core";
import { performLogout } from "@/actions/logout.core";
import { performRefresh } from "@/actions/refresh.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { LoginInput } from "@/lib/api/schemas/auth";
import { userResponseSchema } from "@/lib/api/schemas/auth";
import { nullResponseSchema } from "@/lib/api/schemas/common";
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
    return performRefresh(authCookies, await getTrustedRequestOrigin(), {
      rotate: async (cookies, origin, csrfToken) => {
        const response = await apiClient.request({
          path: apiEndpoints.auth.refresh,
          method: "POST",
          cookies,
          headers: { Origin: origin, "X-CSRF-Token": csrfToken },
          responseSchema: userResponseSchema,
        });
        return { user: response.data.data.user, headers: response.headers };
      },
      synchronize: synchronizeAuthCookies,
      clear: clearMirroredAuthCookies,
    });
  } catch {
    await clearMirroredAuthCookies();
    return { success: false };
  }
}

export async function logoutAction(): Promise<never> {
  const authCookies = await getAuthCookies();
  let origin = "";
  try {
    origin = await getTrustedRequestOrigin();
  } catch {
    // Local cookies are still cleared when a trusted Origin is unavailable.
  }
  try {
    await performLogout(authCookies, origin, {
      revoke: async (cookies, trustedOrigin, csrfToken) => {
        await apiClient.request({
          path: apiEndpoints.auth.logout,
          method: "POST",
          cookies,
          headers: { Origin: trustedOrigin, "X-CSRF-Token": csrfToken },
          responseSchema: nullResponseSchema,
        });
      },
      clear: clearMirroredAuthCookies,
    });
  } catch {
    // Revocation failure must not leave frontend-owned cookies behind.
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
