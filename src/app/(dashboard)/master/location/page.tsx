import { fetchLocations, getWarehouses } from "@/app/actions/locationActions";
import { LocationTable } from "@/components/Dashboard/Master/Location/LocationTable";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchLocations(page, 10, search);
  const warehouses = await getWarehouses();
  return (
    <section className="table-wrapper">
      <LocationTable
        initialData={data}
        initialPagination={pagination}
        warehouses={warehouses}
      />
    </section>
  );
}
