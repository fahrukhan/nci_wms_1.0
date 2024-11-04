import { fetchSOWarehouseData } from "@/app/actions/transactionActions";
import { StockOpnameTable } from "@/components/Dashboard/Transaction/Stock-Opname/StockOpnameTable";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Stock Opname";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION =
  "Stock Opname Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default async function Page() {
  const data = await fetchSOWarehouseData();
  const warehouseData = [{ value: null, label: "All Warehouse" }, ...data];
  return (
    <section className="table-wrapper">
      <StockOpnameTable warehouseData={warehouseData} />
    </section>
  );
}
