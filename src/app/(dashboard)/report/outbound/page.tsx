import { fetchOutboundCustomerData, fetchTransferOriginWarehouseData } from "@/app/actions/transactionActions";
import { OutboundTable } from "@/components/Dashboard/Transaction/Outbound/OutboundTable";
import { getUserWarehouses } from "@/lib/utils/GetUserWarehouse";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Outbound";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Outbound Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default async function Page() {
  const data = await fetchOutboundCustomerData();
  const customerData = [{ value: null, label: "All Customers" }, ...data];

  const warehouses = await getUserWarehouses();

  return (
    <section className="table-wrapper">
      <OutboundTable customerData={customerData} warehouseData={warehouses}/>
    </section>
  );
}
