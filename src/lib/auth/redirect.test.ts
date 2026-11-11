import { expect, test } from "bun:test";
import { getSafeReturnPath } from "@/lib/auth/redirect";

test("allows only local protected application destinations", () => {
  expect(getSafeReturnPath("/patients?page=2")).toBe("/patients?page=2");
  expect(getSafeReturnPath("/doctors/507f1f77bcf86cd799439011")).toBe(
    "/doctors/507f1f77bcf86cd799439011",
  );
  for (const unsafe of [
    "https://evil.example",
    "//evil.example",
    "/login",
    "/%5cevil.example",
    "/patients%0d%0aSet-Cookie:x",
  ])
    expect(getSafeReturnPath(unsafe)).toBe("/dashboard");
});
