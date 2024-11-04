import { fetchUnits } from "@/app/actions/unitActions";
import { UnitTable } from "@/components/Dashboard/Master/Unit/UnitTable";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Unit";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Unit Master Data on Warehouse Management System";

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
  const { data, pagination } = await fetchUnits(page, 10, search);

  return (
    <section className="table-wrapper">
      <UnitTable initialData={data} initialPagination={pagination} />
    </section>
  );
}
