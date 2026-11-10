import { expect, mock, test } from "bun:test";
import { z } from "zod";

import { createApiClient } from "@/lib/api/client.core";

const responseSchema = z.object({ ok: z.literal(true) }).strict();

test("builds a safe URL, forwards only known cookies, and validates JSON", async () => {
  const fetchImpl = mock(async (input: string | URL | Request, init?: RequestInit) => {
    expect(input.toString()).toBe("http://localhost:8000/api/v1/doctors?page=1");
    expect(new Headers(init?.headers).get("cookie")).toBe(
      "doctor_tracker_access=access; doctor_tracker_csrf=csrf",
    );

    return Response.json({ ok: true });
  });
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1", fetchImpl });

  const result = await client.request({
    path: "doctors?page=1",
    responseSchema,
    cookies: {
      doctor_tracker_access: "access",
      doctor_tracker_csrf: "csrf",
    },
  });

  expect(result.data).toEqual({ ok: true });
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("allows one explicit network retry for an idempotent request", async () => {
  const fetchImpl = mock(async () => {
    if (fetchImpl.mock.calls.length === 1) {
      throw new TypeError("network unavailable");
    }

    return Response.json({ ok: true });
  });
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1", fetchImpl });

  await expect(
    client.request({ path: "doctors", responseSchema, maxNetworkRetries: 1 }),
  ).resolves.toMatchObject({ data: { ok: true } });
  expect(fetchImpl).toHaveBeenCalledTimes(2);
});

test("rejects retries and bodies for unsafe or idempotent methods respectively", async () => {
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1" });

  await expect(
    client.request({
      path: "doctors",
      method: "POST",
      body: { name: "Doctor" },
      responseSchema,
      maxNetworkRetries: 1,
    }),
  ).rejects.toThrow("Network retries are not allowed");
  await expect(
    client.request({ path: "doctors", method: "GET", body: {}, responseSchema }),
  ).rejects.toThrow("GET API requests cannot include a body");
});

test("rejects absolute paths and base-path traversal", async () => {
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1" });

  await expect(client.request({ path: "https://evil.example", responseSchema })).rejects.toThrow(
    "relative path",
  );
  await expect(client.request({ path: "../health", responseSchema })).rejects.toThrow(
    "outside the configured base URL",
  );
});
