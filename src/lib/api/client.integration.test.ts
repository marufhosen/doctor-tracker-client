import { expect, mock, test } from "bun:test";

import { createApiClient } from "@/lib/api/client.core";
import { ApiClientError } from "@/lib/api/errors";
import { doctorListResponseSchema, doctorResponseSchema } from "@/lib/api/schemas";

const doctor = {
  id: "671000000000000000000001",
  name: "Dr. Samira Khan",
  specialization: "Cardiology",
  hospital: "City Hospital",
  phone: "+880 1712-345678",
  email: "samira@example.com",
  createdAt: "2026-11-11T08:30:00.000Z",
  updatedAt: "2026-11-11T08:30:00.000Z",
};

const doctorInput = {
  name: doctor.name,
  specialization: doctor.specialization,
  hospital: doctor.hospital,
  phone: doctor.phone,
  email: doctor.email,
};

test("parses a paginated Express response and preserves response headers", async () => {
  const fetchImpl = mock(async (_input: string | URL | Request, init?: RequestInit) => {
    expect(init?.cache).toBe("no-store");
    expect(init?.redirect).toBe("error");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Doctors retrieved successfully",
        data: [doctor],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Rotation": "present",
        },
      },
    );
  });
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1", fetchImpl });

  const result = await client.request({
    path: "doctors",
    responseSchema: doctorListResponseSchema,
  });

  expect(result.data.data[0]?.name).toBe("Dr. Samira Khan");
  expect(result.headers.get("x-auth-rotation")).toBe("present");
});

test("sends a JSON mutation once with explicit Origin and CSRF headers", async () => {
  const fetchImpl = mock(async (_input: string | URL | Request, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    expect(init?.method).toBe("POST");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("origin")).toBe("http://localhost:3000");
    expect(headers.get("x-csrf-token")).toBe("csrf-token");
    expect(init?.body).toBe(JSON.stringify(doctorInput));

    return Response.json({
      success: true,
      message: "Doctor created successfully",
      data: { doctor },
    });
  });
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1", fetchImpl });

  await client.request({
    path: "doctors",
    method: "POST",
    body: doctorInput,
    headers: { Origin: "http://localhost:3000", "X-CSRF-Token": "csrf-token" },
    responseSchema: doctorResponseSchema,
  });

  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("strips raw caller-provided cookies that bypass the auth-cookie allowlist", async () => {
  const fetchImpl = mock(async (_input: string | URL | Request, init?: RequestInit) => {
    expect(new Headers(init?.headers).get("cookie")).toBeNull();

    return Response.json({
      success: true,
      message: "Doctors retrieved successfully",
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
  });
  const client = createApiClient({ baseUrl: "http://localhost:8000/api/v1", fetchImpl });

  await client.request({
    path: "doctors",
    headers: { Cookie: "untrusted_session=secret" },
    responseSchema: doctorListResponseSchema,
  });
});

test("maps an Express authentication response without leaking its message", async () => {
  const client = createApiClient({
    baseUrl: "http://localhost:8000/api/v1",
    fetchImpl: async () =>
      Response.json(
        {
          success: false,
          message: "JWT signature detail that must not escape",
          error: { code: "INVALID_ACCESS_TOKEN" },
        },
        { status: 401 },
      ),
  });

  const error = await client
    .request({ path: "doctors", responseSchema: doctorListResponseSchema })
    .catch((caught: unknown) => caught);

  expect(error).toBeInstanceOf(ApiClientError);
  expect((error as ApiClientError).kind).toBe("unauthenticated");
  expect((error as ApiClientError).message).not.toContain("JWT");
});

test("normalizes a deterministic timeout and does not retry it", async () => {
  const timeoutReason = new DOMException("internal timeout detail", "TimeoutError");
  const fetchImpl = mock(async (_input: string | URL | Request, init?: RequestInit) => {
    return Promise.reject(init?.signal?.reason);
  });
  const client = createApiClient({
    baseUrl: "http://localhost:8000/api/v1",
    fetchImpl,
    createTimeoutSignal: () => AbortSignal.abort(timeoutReason),
  });

  const error = await client
    .request({ path: "doctors", responseSchema: doctorListResponseSchema, maxNetworkRetries: 1 })
    .catch((caught: unknown) => caught);

  expect((error as ApiClientError).kind).toBe("timeout");
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("does not retry malformed success payloads or mutation network failures", async () => {
  const malformedFetch = mock(async () => Response.json({ success: true, data: { token: "raw" } }));
  const malformedClient = createApiClient({
    baseUrl: "http://localhost:8000/api/v1",
    fetchImpl: malformedFetch,
  });

  const malformedError = await malformedClient
    .request({ path: "doctors", responseSchema: doctorListResponseSchema, maxNetworkRetries: 1 })
    .catch((caught: unknown) => caught);
  expect((malformedError as ApiClientError).kind).toBe("invalid_response");
  expect(malformedFetch).toHaveBeenCalledTimes(1);

  const mutationFetch = mock(async () => {
    throw new TypeError("network detail");
  });
  const mutationClient = createApiClient({
    baseUrl: "http://localhost:8000/api/v1",
    fetchImpl: mutationFetch,
  });
  const mutationError = await mutationClient
    .request({
      path: "doctors",
      method: "POST",
      body: doctorInput,
      responseSchema: doctorResponseSchema,
    })
    .catch((caught: unknown) => caught);

  expect((mutationError as ApiClientError).kind).toBe("network");
  expect(mutationFetch).toHaveBeenCalledTimes(1);
});
