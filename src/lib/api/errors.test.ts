import { expect, test } from "bun:test";

import {
  ApiClientError,
  createApiHttpError,
  normalizeApiClientError,
  toSafeApiError,
} from "@/lib/api/errors";

test("normalizes backend validation issues into field errors", async () => {
  const error = await createApiHttpError(
    Response.json(
      {
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details: [
            { code: "invalid_format", message: "Invalid email", path: ["body", "email"] },
            { code: "too_small", message: "Required", path: ["body", "name"] },
          ],
        },
      },
      { status: 400 },
    ),
  );

  expect(toSafeApiError(error)).toEqual({
    kind: "validation",
    message: "Please review the highlighted fields.",
    status: 400,
    code: "VALIDATION_ERROR",
    fieldErrors: { email: ["Invalid email"], name: ["Required"] },
  });
});

test("maps authentication, authorization, missing, rate, and server statuses", async () => {
  const cases = [
    [401, "unauthenticated"],
    [403, "forbidden"],
    [404, "not_found"],
    [429, "rate_limited"],
    [503, "server"],
  ] as const;

  for (const [status, kind] of cases) {
    const error = await createApiHttpError(new Response("not-json", { status }));
    expect(error.kind).toBe(kind);
    expect(error.message).not.toContain("not-json");
  }
});

test("normalizes network, timeout, invalid payload, and unknown failures safely", () => {
  expect(normalizeApiClientError(new TypeError("private DNS detail")).kind).toBe("network");
  expect(
    normalizeApiClientError(new DOMException("timed out internally", "TimeoutError")).kind,
  ).toBe("timeout");
  expect(normalizeApiClientError(new SyntaxError("raw response fragment")).kind).toBe(
    "invalid_response",
  );

  const safe = toSafeApiError(new Error("database host and stack details"));
  expect(safe).toEqual({ kind: "unknown", message: "Something went wrong. Please try again." });
  expect(JSON.stringify(safe)).not.toContain("database");
});

test("preserves an already normalized API error", () => {
  const original = new ApiClientError("forbidden", "Safe message", { status: 403 });
  expect(normalizeApiClientError(original)).toBe(original);
});
