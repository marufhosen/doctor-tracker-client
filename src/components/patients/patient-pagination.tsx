import type { Route } from "next";

import { ListPagination } from "@/components/list-pagination";
import type { ParsedPatientListQuery } from "@/lib/api/query";
import type { PaginationMeta } from "@/lib/api/schemas/common";

const pageHref = (query: ParsedPatientListQuery, page: number): Route => {
  const params = new URLSearchParams();
  const values = {
    search: query.search,
    doctorId: query.doctorId,
    condition: query.condition,
    createdFrom: query.createdFrom?.slice(0, 10),
    createdTo: query.createdTo?.slice(0, 10),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    limit: query.limit === 10 ? undefined : String(query.limit),
    page: page === 1 ? undefined : String(page),
  };
  for (const [key, value] of Object.entries(values)) if (value) params.set(key, value);
  return `/patients${params.size ? `?${params}` : ""}` as Route;
};

export function PatientPagination({
  meta,
  query,
}: {
  meta: PaginationMeta;
  query: ParsedPatientListQuery;
}) {
  return (
    <ListPagination
      meta={meta}
      label="Patient pagination"
      pageHref={(page) => pageHref(query, page)}
    />
  );
}
