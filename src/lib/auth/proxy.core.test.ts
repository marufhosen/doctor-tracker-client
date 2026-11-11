import { expect, test } from "bun:test";

import { getProxyDecision, hasUsableAccessToken } from "@/lib/auth/proxy.core";

test("refreshes protected routes when only the refresh cookie remains", () => {
  expect(getProxyDecision("/dashboard", false, false)).toBe("login");
  expect(getProxyDecision("/doctors", true, false)).toBe("continue");
  expect(getProxyDecision("/patients", false, true)).toBe("refresh");
  expect(getProxyDecision("/refresh", false, true)).toBe("continue");
});

test("recognizes usable and expired JWT access cookies", () => {
  const token = (exp: number) => `header.${btoa(JSON.stringify({ exp }))}.signature`;
  expect(hasUsableAccessToken(token(200), 100)).toBe(true);
  expect(hasUsableAccessToken(token(100), 100)).toBe(false);
  expect(hasUsableAccessToken("deleted-or-invalid", 100)).toBe(false);
});

test("redirects login only for an existing access cookie", () => {
  expect(getProxyDecision("/login", true, true)).toBe("dashboard");
  expect(getProxyDecision("/login", false, true)).toBe("continue");
  expect(getProxyDecision("/login", false, false)).toBe("continue");
});
