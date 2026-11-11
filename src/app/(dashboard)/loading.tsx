import { PageSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="overflow-hidden">
      <PageSkeleton />
    </div>
  );
}
