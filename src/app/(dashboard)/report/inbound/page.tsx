import { fetchSupplierInboundData, fetchTransferOriginWarehouseData } from "@/app/actions/transactionActions";
import { InboundTable } from "@/components/Dashboard/Transaction/inbound/InboundTable";
import { getUserWarehouses } from "@/lib/utils/GetUserWarehouse";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Inbound";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Inbound Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default async function Page() {
  const data = await fetchSupplierInboundData();
  const supplierData = [{ value: null, label: "All Supplier" }, ...data];

  const warehouses = await getUserWarehouses();

  return (
    <section className="table-wrapper">
      <InboundTable supplierData={supplierData} warehouseData={warehouses} />
    </section>
  );
}
