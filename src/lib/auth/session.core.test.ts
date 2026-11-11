import { expect, mock, test } from "bun:test";

import { ApiClientError } from "@/lib/api/errors";
import { resolveSession } from "@/lib/auth/session.core";

const user = {
  id: "671000000000000000000001",
  name: "Admin User",
  email: "admin@example.com",
  role: "ADMIN" as const,
};

test("does not call auth/me when the access cookie is missing", async () => {
  const fetchUser = mock(async () => user);
  expect(await resolveSession({}, fetchUser)).toEqual({ status: "unauthenticated" });
  expect(fetchUser).not.toHaveBeenCalled();
});

test("returns a validated authenticated user", async () => {
  expect(await resolveSession({ doctor_tracker_access: "access" }, async () => user)).toEqual({
    status: "authenticated",
    user,
  });
});

test("handles expired and inactive sessions as unauthenticated", async () => {
  const state = await resolveSession({ doctor_tracker_access: "expired" }, async () => {
    throw new ApiClientError("unauthenticated", "Session expired", { status: 401 });
  });
  expect(state).toEqual({ status: "unauthenticated" });
});

test("keeps backend outages distinct from an invalid session", async () => {
  const state = await resolveSession({ doctor_tracker_access: "access" }, async () => {
    throw new ApiClientError("network", "Unavailable");
  });
  expect(state).toEqual({ status: "unavailable" });
});
