import "server-only";

import { createApiClient } from "@/lib/api/client.core";
import { serverEnvironment } from "@/lib/env.server";

export const apiClient = createApiClient({
  baseUrl: serverEnvironment.apiBaseUrl,
});
