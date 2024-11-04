import { fetchAttributes } from "@/app/actions/attributeActions";
import { AttributeTable } from "@/components/Dashboard/Master/Attribute/AttributeTable";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchAttributes(page, 10, search);

  return (
    <section className="table-wrapper">
      <Suspense fallback={<div>Loading...</div>}>
        <AttributeTable initialData={data} initialPagination={pagination} />
      </Suspense>
    </section>
  );
}
