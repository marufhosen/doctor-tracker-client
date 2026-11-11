import { expect, mock, test } from "bun:test";

import { performLogin } from "@/actions/auth.core";
import { performLogout } from "@/actions/logout.core";
import { performRefresh } from "@/actions/refresh.core";
import { type MirroredCookie, syncAuthCookiesFromHeaders } from "@/lib/auth/cookies.core";
import { getProtectedRouteDecision } from "@/lib/auth/protected.core";
import { getProxyDecision } from "@/lib/auth/proxy.core";

const admin = {
  id: "671000000000000000000001",
  name: "Admin User",
  email: "admin@example.com",
  role: "ADMIN" as const,
};

const authHeaders = (suffix: string, persistent = false) => {
  const headers = new Headers();
  const lifetime = persistent ? "; Max-Age=2592000; Expires=Fri, 11 Dec 2026 00:00:00 GMT" : "";
  headers.append(
    "set-cookie",
    `doctor_tracker_access=access-${suffix}${lifetime}; Path=/api/v1; HttpOnly; SameSite=Lax`,
  );
  headers.append(
    "set-cookie",
    `doctor_tracker_refresh=refresh-${suffix}${lifetime}; Path=/api/v1/auth; HttpOnly; SameSite=Lax`,
  );
  headers.append(
    "set-cookie",
    `doctor_tracker_csrf=csrf-${suffix}${lifetime}; Path=/api/v1; SameSite=Lax`,
  );
  return headers;
};

test("runs login, remembered cookie adoption, CSRF rotation, guards, and logout", async () => {
  const jar = new Map<string, MirroredCookie>();
  const synchronize = async (headers: Headers) =>
    syncAuthCookiesFromHeaders({ set: (cookie) => jar.set(cookie.name, cookie) }, headers);

  const login = await performLogin(
    { email: admin.email, password: "password", rememberMe: true },
    "http://localhost:3000",
    {
      login: async () => ({ user: admin, headers: authHeaders("one", true) }),
      synchronizeCookies: synchronize,
    },
  );
  expect(login.success).toBe(true);
  expect(jar.get("doctor_tracker_refresh")?.maxAge).toBe(2_592_000);

  const rotate = mock(async (_cookies, origin: string, csrfToken: string) => {
    expect(origin).toBe("http://localhost:3000");
    expect(csrfToken).toBe("csrf-one");
    return { user: admin, headers: authHeaders("two", true) };
  });
  const refresh = await performRefresh(
    { doctor_tracker_refresh: "refresh-one", doctor_tracker_csrf: "csrf-one" },
    "http://localhost:3000",
    { rotate, synchronize, clear: async () => jar.clear() },
  );
  expect(refresh.success).toBe(true);
  expect(jar.get("doctor_tracker_refresh")?.value).toBe("refresh-two");
  expect(getProxyDecision("/dashboard", true, true)).toBe("continue");
  expect(getProtectedRouteDecision({ status: "authenticated", user: admin })).toBe("allow");

  const revoke = mock(async () => undefined);
  await performLogout(
    { doctor_tracker_refresh: "refresh-two", doctor_tracker_csrf: "csrf-two" },
    "http://localhost:3000",
    { revoke, clear: async () => jar.clear() },
  );
  expect(revoke).toHaveBeenCalledTimes(1);
  expect(jar.size).toBe(0);
});
