import { ZodError, z } from "zod";

import { apiErrorResponseSchema } from "@/lib/api/schemas/common";

export type ApiErrorKind =
  | "validation"
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "server"
  | "network"
  | "timeout"
  | "cancelled"
  | "invalid_response"
  | "unknown";

export interface SafeApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

interface ApiClientErrorOptions {
  status?: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;
  cause?: unknown;
}

export class ApiClientError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(kind: ApiErrorKind, message: string, options: ApiClientErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "ApiClientError";
    this.kind = kind;
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }
}

const validationIssueSchema = z
  .object({
    message: z.string().min(1),
    path: z.array(z.union([z.string(), z.number()])),
  })
  .passthrough();

const safeMessages: Record<ApiErrorKind, string> = {
  validation: "Please review the highlighted fields.",
  unauthenticated: "Your session has expired. Please sign in again.",
  forbidden: "You do not have permission to perform this action.",
  not_found: "The requested record could not be found.",
  rate_limited: "Too many requests. Please wait a moment and try again.",
  server: "The service is temporarily unavailable. Please try again.",
  network: "Unable to reach the service. Check your connection and try again.",
  timeout: "The request took too long. Please try again.",
  cancelled: "The request was cancelled.",
  invalid_response: "The service returned an unexpected response.",
  unknown: "Something went wrong. Please try again.",
};

const kindFromStatus = (status: number): ApiErrorKind => {
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
};

const normalizeFieldErrors = (details: unknown): Record<string, string[]> | undefined => {
  const result = z.array(validationIssueSchema).safeParse(details);

  if (!result.success) return undefined;

  const fieldErrors: Record<string, string[]> = {};

  for (const issue of result.data) {
    const path = issue.path.filter(
      (segment) => !["body", "query", "params"].includes(String(segment)),
    );
    const field = path.join(".") || "form";
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

export async function createApiHttpError(response: Response): Promise<ApiClientError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  const parsed = apiErrorResponseSchema.safeParse(payload);
  const kind = kindFromStatus(response.status);
  const fieldErrors =
    parsed.success && kind === "validation"
      ? normalizeFieldErrors(parsed.data.error.details)
      : undefined;

  return new ApiClientError(kind, safeMessages[kind], {
    status: response.status,
    ...(parsed.success ? { code: parsed.data.error.code } : {}),
    ...(fieldErrors ? { fieldErrors } : {}),
  });
}

export function normalizeApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error;

  if (error instanceof ZodError || error instanceof SyntaxError) {
    return new ApiClientError("invalid_response", safeMessages.invalid_response, { cause: error });
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new ApiClientError("timeout", safeMessages.timeout, { cause: error });
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiClientError("cancelled", safeMessages.cancelled, { cause: error });
  }
  if (error instanceof TypeError) {
    return new ApiClientError("network", safeMessages.network, { cause: error });
  }

  return new ApiClientError("unknown", safeMessages.unknown, { cause: error });
}

export function toSafeApiError(error: unknown): SafeApiError {
  const normalized = normalizeApiClientError(error);

  return {
    kind: normalized.kind,
    message: normalized.message,
    ...(normalized.status !== undefined ? { status: normalized.status } : {}),
    ...(normalized.code !== undefined ? { code: normalized.code } : {}),
    ...(normalized.fieldErrors !== undefined ? { fieldErrors: normalized.fieldErrors } : {}),
  };
}
