import "server-only";

import { cache } from "react";

import { apiClient } from "@/lib/api/client.server";
import { apiEndpoints } from "@/lib/api/endpoints";
import { userResponseSchema } from "@/lib/api/schemas/auth";
import { getAuthCookies } from "@/lib/auth/cookies.server";
import { resolveSession } from "@/lib/auth/session.core";

const loadSession = async () => {
  const cookies = await getAuthCookies();
  return resolveSession(cookies, async (authCookies) => {
    const response = await apiClient.request({
      path: apiEndpoints.auth.me,
      cookies: authCookies,
      responseSchema: userResponseSchema,
      cache: "no-store",
    });
    return response.data.data.user;
  });
};

export const getSession = cache(loadSession);
