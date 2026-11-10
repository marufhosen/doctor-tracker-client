"use server";

import { headers } from "next/headers";

import { type LoginActionResult, performLogin } from "@/actions/auth.core";
import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { LoginInput } from "@/lib/api/schemas/auth";
import { userResponseSchema } from "@/lib/api/schemas/auth";
import { synchronizeAuthCookies } from "@/lib/auth/cookies.server";

const getTrustedRequestOrigin = async (): Promise<string> => {
  const origin = (await headers()).get("origin");
  if (!origin) throw new Error("Request origin is required");
  const parsed = new URL(origin);
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.origin !== origin) {
    throw new Error("Request origin is invalid");
  }
  return origin;
};

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
