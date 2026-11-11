import { expect, test } from "bun:test";

import { getProtectedRouteDecision } from "@/lib/auth/protected.core";

test("allows only an authenticated administrator", () => {
  expect(
    getProtectedRouteDecision({
      status: "authenticated",
      user: { id: "671000000000000000000001", name: "Admin", email: "a@b.com", role: "ADMIN" },
    }),
  ).toBe("allow");
  expect(
    getProtectedRouteDecision({
      status: "authenticated",
      user: { id: "671000000000000000000002", name: "User", email: "u@b.com", role: "USER" },
    }),
  ).toBe("forbidden");
});

test("distinguishes invalid sessions from backend outages", () => {
  expect(getProtectedRouteDecision({ status: "unauthenticated" })).toBe("login");
  expect(getProtectedRouteDecision({ status: "unavailable" })).toBe("unavailable");
});
