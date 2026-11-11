import { expect, mock, test } from "bun:test";

import { performLogout } from "@/actions/logout.core";

test("revokes a complete session and always clears local cookies", async () => {
  const revoke = mock(async () => undefined);
  const clear = mock(async () => undefined);
  await performLogout(
    { doctor_tracker_refresh: "refresh", doctor_tracker_csrf: "csrf" },
    "http://localhost:3000",
    { revoke, clear },
  );
  expect(revoke).toHaveBeenCalledTimes(1);
  expect(clear).toHaveBeenCalledTimes(1);
});

test("clears cookies when revocation fails and is safe without a session", async () => {
  const clear = mock(async () => undefined);
  await expect(
    performLogout(
      { doctor_tracker_refresh: "refresh", doctor_tracker_csrf: "csrf" },
      "http://localhost:3000",
      { revoke: async () => Promise.reject(new Error("backend unavailable")), clear },
    ),
  ).rejects.toThrow();
  expect(clear).toHaveBeenCalledTimes(1);

  const revoke = mock(async () => undefined);
  await performLogout({}, "http://localhost:3000", { revoke, clear });
  expect(revoke).not.toHaveBeenCalled();
});
