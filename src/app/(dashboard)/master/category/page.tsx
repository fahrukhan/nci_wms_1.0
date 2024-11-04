import { fetchCategories } from "@/app/actions/categoryActions";
import { CategoryTable } from "@/components/Dashboard/Master/Category/CategoryTable";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchCategories(page, 10, search);

  return (
    <section className="table-wrapper">
      <CategoryTable initialData={data} initialPagination={pagination} />
    </section>
  );
}
