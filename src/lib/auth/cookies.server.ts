import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIE_NAMES, type AuthCookies } from "@/lib/api/cookies";
import { syncAuthCookiesFromHeaders } from "@/lib/auth/cookies.core";

export async function getAuthCookies(): Promise<AuthCookies> {
  const store = await cookies();
  const authCookies: AuthCookies = {};

  for (const name of AUTH_COOKIE_NAMES) {
    const value = store.get(name)?.value;
    if (value) authCookies[name] = value;
  }

  return authCookies;
}

export async function synchronizeAuthCookies(headers: Headers): Promise<number> {
  const store = await cookies();
  return syncAuthCookiesFromHeaders(store, headers);
}

export async function clearMirroredAuthCookies(): Promise<void> {
  const store = await cookies();
  for (const name of AUTH_COOKIE_NAMES) {
    store.set({ name, value: "", path: "/", expires: new Date(0) });
  }
}
