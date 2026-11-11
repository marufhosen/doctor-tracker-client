import "server-only";

import type { z } from "zod";
import type { ApiClientResponse, ApiRequestOptions } from "@/lib/api/client.core";
import { apiClient } from "@/lib/api/client.server";
import type { AuthCookies } from "@/lib/api/cookies";
import { ApiClientError } from "@/lib/api/errors";
import {
  clearMirroredAuthCookies,
  getAuthCookies,
  synchronizeAuthCookies,
} from "@/lib/auth/cookies.server";
import { getTrustedRequestOrigin } from "@/lib/auth/origin.server";
import { rotateAuthSession } from "@/lib/auth/rotate.server";

type AuthenticatedRequestOptions<ResponseSchema extends z.ZodType> = Omit<
  ApiRequestOptions<ResponseSchema>,
  "cookies"
>;

async function prepareRequest<ResponseSchema extends z.ZodType>(
  options: AuthenticatedRequestOptions<ResponseSchema>,
  cookies: AuthCookies,
): Promise<ApiRequestOptions<ResponseSchema>> {
  const method = options.method ?? "GET";
  if (method === "GET" || method === "HEAD") return { ...options, cookies };

  const csrfToken = cookies.doctor_tracker_csrf;
  if (!csrfToken) throw new ApiClientError("unauthenticated", "Your session has expired.");

  const headers = new Headers(options.headers);
  headers.set("Origin", await getTrustedRequestOrigin());
  headers.set("X-CSRF-Token", csrfToken);
  return { ...options, cookies, headers };
}

export async function authenticatedActionRequest<ResponseSchema extends z.ZodType>(
  options: AuthenticatedRequestOptions<ResponseSchema>,
): Promise<ApiClientResponse<z.output<ResponseSchema>>> {
  const cookies = await getAuthCookies();

  try {
    return await apiClient.request(await prepareRequest(options, cookies));
  } catch (error) {
    if (!(error instanceof ApiClientError) || error.kind !== "unauthenticated") throw error;

    const rotated = await rotateAuthSession(cookies, await getTrustedRequestOrigin());
    if (!rotated || (await synchronizeAuthCookies(rotated.headers)) !== 3) {
      await clearMirroredAuthCookies();
      throw error;
    }

    return apiClient.request(await prepareRequest(options, rotated.cookies));
  }
}
