import { fetchCustomer } from "@/app/actions/contactActions";
import { CustomerTable } from "@/components/Dashboard/Master/Customer/CustomerTable";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Contact";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Contact Master Data on Warehouse Management System";

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
  const { data, pagination } = await fetchCustomer(page, 10, search);
  return (
    <section className="table-wrapper">
      <CustomerTable initialData={data} initialPagination={pagination} />
    </section>
  );
}
