import { fetchSupplier } from "@/app/actions/contactActions";
import { SupplierTable } from "@/components/Dashboard/Master/Supplier/SupplierTable";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Supplier";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Supplier Master Data on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const { data, pagination } = await fetchSupplier(page, 10, search);

  return (
    <section className="table-wrapper">
      <SupplierTable initialData={data} initialPagination={pagination} />
    </section>
  );
}