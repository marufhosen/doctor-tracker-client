import { expect, test } from "bun:test";

import {
  type MirroredCookie,
  parseAuthSetCookie,
  syncAuthCookiesFromHeaders,
} from "@/lib/auth/cookies.core";

test("mirrors session cookies at the frontend root with security attributes", () => {
  expect(
    parseAuthSetCookie(
      "doctor_tracker_access=access-token; Path=/api/v1; HttpOnly; SameSite=Lax; Priority=High",
    ),
  ).toEqual({
    name: "doctor_tracker_access",
    value: "access-token",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    priority: "high",
  });
});

test("preserves persistent expiry and clearing semantics", () => {
  const persistent = parseAuthSetCookie(
    "doctor_tracker_refresh=refresh; Max-Age=2592000; Expires=Fri, 11 Dec 2026 00:00:00 GMT; Path=/api/v1/auth; HttpOnly; Secure; SameSite=None",
  );
  const cleared = parseAuthSetCookie(
    "doctor_tracker_refresh=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/api/v1/auth; HttpOnly; SameSite=Lax",
  );

  expect(persistent).toMatchObject({ maxAge: 2_592_000, secure: true, sameSite: "none" });
  expect(persistent?.expires?.toISOString()).toBe("2026-12-11T00:00:00.000Z");
  expect(cleared?.value).toBe("");
  expect(cleared?.expires?.getTime()).toBe(0);
});

test("synchronizes only the three known authentication cookies", () => {
  const headers = new Headers();
  headers.append("set-cookie", "doctor_tracker_access=access; Path=/api/v1; HttpOnly");
  headers.append("set-cookie", "unrelated=value; Path=/");
  headers.append("set-cookie", "doctor_tracker_csrf=csrf; Path=/api/v1; SameSite=Strict");
  const mirrored: MirroredCookie[] = [];

  const count = syncAuthCookiesFromHeaders({ set: (cookie) => mirrored.push(cookie) }, headers);

  expect(count).toBe(2);
  expect(mirrored.map((cookie) => cookie.name)).toEqual([
    "doctor_tracker_access",
    "doctor_tracker_csrf",
  ]);
});
