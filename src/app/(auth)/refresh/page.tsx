import { RefreshCoordinator } from "@/components/auth/refresh-coordinator";
import { getSafeReturnPath } from "@/lib/auth/redirect";

export const instant = false;

export default async function RefreshPage({ searchParams }: PageProps<"/refresh">) {
  const returnTo = getSafeReturnPath((await searchParams).next);
  return <RefreshCoordinator returnTo={returnTo} />;
}
