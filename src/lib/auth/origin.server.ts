import "server-only";

import { headers } from "next/headers";

export async function getTrustedRequestOrigin(): Promise<string> {
  const origin = (await headers()).get("origin");
  if (!origin) throw new Error("Request origin is required");
  const parsed = new URL(origin);
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.origin !== origin) {
    throw new Error("Request origin is invalid");
  }
  return origin;
}
