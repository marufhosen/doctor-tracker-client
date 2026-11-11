import type { z } from "zod";

import { type AuthCookies, serializeAuthCookies } from "@/lib/api/cookies";
import { createApiHttpError, normalizeApiClientError } from "@/lib/api/errors";

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type ApiMethod = "GET" | "HEAD" | "POST" | "PATCH" | "DELETE";

export interface ApiRequestOptions<ResponseSchema extends z.ZodType> {
  path: string;
  responseSchema: ResponseSchema;
  method?: ApiMethod;
  body?: unknown;
  cookies?: AuthCookies;
  headers?: HeadersInit;
  cache?: RequestCache;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxNetworkRetries?: 0 | 1;
}

export interface ApiClientResponse<Data> {
  data: Data;
  headers: Headers;
  status: number;
}

export interface ApiClient {
  request<ResponseSchema extends z.ZodType>(
    options: ApiRequestOptions<ResponseSchema>,
  ): Promise<ApiClientResponse<z.output<ResponseSchema>>>;
}

interface ApiClientConfig {
  baseUrl: string;
  fetchImpl?: FetchLike;
  defaultTimeoutMs?: number;
  createTimeoutSignal?: (timeoutMs: number) => AbortSignal;
}

const createApiUrl = (baseUrl: URL, path: string): URL => {
  if (!path || URL.canParse(path)) {
    throw new Error("API path must be a non-empty relative path");
  }

  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const url = new URL(path.replace(/^\/+/, ""), `${baseUrl.toString().replace(/\/+$/, "")}/`);

  if (
    url.origin !== baseUrl.origin ||
    (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) ||
    url.hash
  ) {
    throw new Error("API path resolves outside the configured base URL");
  }

  return url;
};

const createRequestSignal = (
  signal: AbortSignal | undefined,
  timeoutMs: number,
  createTimeoutSignal: (timeoutMs: number) => AbortSignal,
): AbortSignal => {
  const timeoutSignal = createTimeoutSignal(timeoutMs);

  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
};

export function createApiClient({
  baseUrl,
  fetchImpl = fetch,
  defaultTimeoutMs = 8_000,
  createTimeoutSignal = (timeoutMs) => AbortSignal.timeout(timeoutMs),
}: ApiClientConfig): ApiClient {
  const parsedBaseUrl = new URL(baseUrl);

  return {
    async request<ResponseSchema extends z.ZodType>({
      path,
      responseSchema,
      method = "GET",
      body,
      cookies,
      headers: inputHeaders,
      cache = "no-store",
      signal,
      timeoutMs = defaultTimeoutMs,
      maxNetworkRetries = 0,
    }: ApiRequestOptions<ResponseSchema>): Promise<ApiClientResponse<z.output<ResponseSchema>>> {
      const isIdempotent = method === "GET" || method === "HEAD";

      if (!isIdempotent && maxNetworkRetries > 0) {
        throw new Error("Network retries are not allowed for non-idempotent API requests");
      }
      if (isIdempotent && body !== undefined) {
        throw new Error(`${method} API requests cannot include a body`);
      }
      if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
        throw new Error("API timeout must be a positive integer");
      }

      const url = createApiUrl(parsedBaseUrl, path);
      const headers = new Headers(inputHeaders);
      const cookieHeader = cookies ? serializeAuthCookies(cookies) : undefined;

      headers.set("Accept", "application/json");
      headers.delete("Cookie");
      if (cookieHeader) {
        headers.set("Cookie", cookieHeader);
      }
      if (body !== undefined) {
        headers.set("Content-Type", "application/json");
      }

      let attempt = 0;

      while (attempt <= maxNetworkRetries) {
        try {
          const response = await fetchImpl(url, {
            method,
            headers,
            cache: cookieHeader ? "no-store" : cache,
            redirect: "error",
            signal: createRequestSignal(signal, timeoutMs, createTimeoutSignal),
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
          });

          if (!response.ok) {
            throw await createApiHttpError(response);
          }

          const payload: unknown = await response.json();

          return {
            data: responseSchema.parse(payload),
            headers: response.headers,
            status: response.status,
          };
        } catch (error) {
          const canRetry =
            attempt < maxNetworkRetries && error instanceof TypeError && !signal?.aborted;

          if (!canRetry) {
            throw normalizeApiClientError(error);
          }

          attempt += 1;
        }
      }

      throw normalizeApiClientError(undefined);
    },
  };
}
