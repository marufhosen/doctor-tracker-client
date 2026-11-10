import "server-only";

import { parseServerEnvironment } from "@/lib/env.schema";

const parsedEnvironment = parseServerEnvironment({
  API_BASE_URL: process.env.API_BASE_URL,
});

export const serverEnvironment = Object.freeze({
  apiBaseUrl: parsedEnvironment.API_BASE_URL,
});
