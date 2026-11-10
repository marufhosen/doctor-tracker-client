import { expect, test } from "bun:test";

import { performLogin } from "@/actions/auth.core";
import type { LoginInput } from "@/lib/api/schemas/auth";
import { parseAuthSetCookie } from "@/lib/auth/cookies.core";

const admin = {
  id: "671000000000000000000001",
  name: "Admin User",
  email: "admin@example.com",
  role: "ADMIN" as const,
};

test("forwards the remember-me choice without changing it", async () => {
  const received: LoginInput[] = [];
  await performLogin(
    { email: admin.email, password: "password", rememberMe: true },
    "http://localhost:3000",
    {
      login: async (input) => {
        received.push(input);
        return { user: admin, headers: new Headers() };
      },
      synchronizeCookies: async () => 3,
    },
  );
  expect(received[0]?.rememberMe).toBe(true);
});

test("keeps standard sessions non-persistent and remembered sessions bounded by backend expiry", () => {
  const session = parseAuthSetCookie(
    "doctor_tracker_refresh=session; Path=/api/v1/auth; HttpOnly; SameSite=Lax",
  );
  const remembered = parseAuthSetCookie(
    "doctor_tracker_refresh=remembered; Max-Age=2592000; Expires=Fri, 11 Dec 2026 00:00:00 GMT; Path=/api/v1/auth; HttpOnly; SameSite=Lax",
  );

  expect(session?.maxAge).toBeUndefined();
  expect(session?.expires).toBeUndefined();
  expect(remembered?.maxAge).toBe(2_592_000);
  expect(remembered?.expires?.toISOString()).toBe("2026-12-11T00:00:00.000Z");
});
