import { expect, test } from "bun:test";

import { parseAuthSetCookie } from "@/lib/auth/cookies.core";

test("rotated cookies preserve the backend lifetime instead of extending it", () => {
  const refresh = parseAuthSetCookie(
    "doctor_tracker_refresh=next-token; Max-Age=3600; Expires=Wed, 11 Nov 2026 05:00:00 GMT; Path=/api/v1/auth; HttpOnly; SameSite=Lax; Priority=High",
  );
  expect(refresh).toMatchObject({
    value: "next-token",
    path: "/",
    maxAge: 3600,
    httpOnly: true,
    priority: "high",
  });
  expect(refresh?.expires?.toISOString()).toBe("2026-11-11T05:00:00.000Z");
});
