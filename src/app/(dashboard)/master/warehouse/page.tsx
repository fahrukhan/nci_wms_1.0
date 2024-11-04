import { fetchWarehouse } from "@/app/actions/warehouseActions";
import { WarehouseTable } from "@/components/Dashboard/Master/Warehouse/WarehouseTable";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchWarehouse(page, 10, search);

  return (
    <section className="table-wrapper">
      <WarehouseTable initialData={data} initialPagination={pagination} />
    </section>
  );
}
