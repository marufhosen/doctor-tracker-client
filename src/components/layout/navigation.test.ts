import { expect, test } from "bun:test";

import { isNavigationItemActive } from "@/components/layout/navigation";

test("matches list and nested routes without matching similarly prefixed routes", () => {
  expect(isNavigationItemActive("/doctors", "/doctors")).toBe(true);
  expect(isNavigationItemActive("/doctors/507f1f77bcf86cd799439011", "/doctors")).toBe(true);
  expect(isNavigationItemActive("/doctorship", "/doctors")).toBe(false);
  expect(isNavigationItemActive("/patients", "/doctors")).toBe(false);
});
