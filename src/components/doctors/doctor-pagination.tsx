import type { Route } from "next";

import { ListPagination } from "@/components/list-pagination";
import type { ParsedDoctorListQuery } from "@/lib/api/query";
import type { PaginationMeta } from "@/lib/api/schemas/common";

const hrefForPage = (query: ParsedDoctorListQuery, page: number): Route => {
  const parameters = new URLSearchParams();
  const values = {
    search: query.search,
    specialization: query.specialization,
    hospital: query.hospital,
    createdFrom: query.createdFrom?.slice(0, 10),
    createdTo: query.createdTo?.slice(0, 10),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    limit: query.limit === 10 ? undefined : String(query.limit),
    page: page === 1 ? undefined : String(page),
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) parameters.set(key, value);
  }
  return `/doctors${parameters.size ? `?${parameters}` : ""}` as Route;
};

export function DoctorPagination({
  meta,
  query,
}: {
  meta: PaginationMeta;
  query: ParsedDoctorListQuery;
}) {
  return (
    <ListPagination
      meta={meta}
      label="Doctor pagination"
      pageHref={(page) => hrefForPage(query, page)}
    />
  );
}
