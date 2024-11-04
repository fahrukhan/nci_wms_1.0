import { fetchProducts } from "@/app/actions/productActions";
import { ProductTable } from "@/components/Dashboard/Master/Product/ProductTable";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchProducts(page, 10, search);

  return (
    <section className="table-wrapper">
      <ProductTable initialData={data} initialPagination={pagination} />
    </section>
  );
}
