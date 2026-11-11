import { expect, test } from "bun:test";

import { getProxyDecision } from "@/lib/auth/proxy.core";

test("redirects protected routes only when both auth cookies are absent", () => {
  expect(getProxyDecision("/dashboard", false, false)).toBe("login");
  expect(getProxyDecision("/doctors", true, false)).toBe("continue");
  expect(getProxyDecision("/patients", false, true)).toBe("continue");
});

test("redirects login only for an existing access cookie", () => {
  expect(getProxyDecision("/login", true, true)).toBe("dashboard");
  expect(getProxyDecision("/login", false, true)).toBe("continue");
  expect(getProxyDecision("/login", false, false)).toBe("continue");
});
