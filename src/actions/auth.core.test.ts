import { expect, mock, test } from "bun:test";

import { performLogin } from "@/actions/auth.core";
import { ApiClientError } from "@/lib/api/errors";

const admin = {
  id: "671000000000000000000001",
  name: "Admin User",
  email: "admin@example.com",
  role: "ADMIN" as const,
};

test("validates login input before calling the backend", async () => {
  const login = mock(async () => ({ user: admin, headers: new Headers() }));
  const result = await performLogin({ email: "invalid", password: "" }, "http://localhost:3000", {
    login,
    synchronizeCookies: async () => 3,
  });
  expect(result.success).toBe(false);
  expect(result).toMatchObject({
    error: {
      fieldErrors: {
        email: ["Enter a valid email address."],
        password: ["Enter your password."],
      },
    },
  });
  expect(login).not.toHaveBeenCalled();
});

test("requires an admin before synchronizing cookies", async () => {
  const synchronizeCookies = mock(async () => 3);
  const result = await performLogin(
    { email: "user@example.com", password: "password", rememberMe: false },
    "http://localhost:3000",
    {
      login: async () => ({ user: { ...admin, role: "USER" }, headers: new Headers() }),
      synchronizeCookies,
    },
  );
  expect(result).toMatchObject({ success: false, error: { kind: "forbidden" } });
  expect(synchronizeCookies).not.toHaveBeenCalled();
});

test("synchronizes all cookies for a successful admin login", async () => {
  const synchronizeCookies = mock(async () => 3);
  const result = await performLogin(
    { email: "ADMIN@example.com", password: "password", rememberMe: true },
    "http://localhost:3000",
    { login: async () => ({ user: admin, headers: new Headers() }), synchronizeCookies },
  );
  expect(result).toEqual({ success: true, user: admin });
  expect(synchronizeCookies).toHaveBeenCalledTimes(1);
});

test("returns a safe invalid-credentials error", async () => {
  const result = await performLogin(
    { email: "admin@example.com", password: "wrong" },
    "http://localhost:3000",
    {
      login: async () => {
        throw new ApiClientError("unauthenticated", "Generic", {
          status: 401,
          code: "INVALID_CREDENTIALS",
        });
      },
      synchronizeCookies: async () => 0,
    },
  );
  expect(result).toMatchObject({
    success: false,
    error: { kind: "unauthenticated", message: "Email or password is incorrect." },
  });
});
