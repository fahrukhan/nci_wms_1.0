import {
  fetchTransferDestinationWarehouseData,
  fetchTransferOriginWarehouseData
} from "@/app/actions/transactionActions";
import { RelocationTable } from "@/components/Dashboard/Transaction/Relocation/RelocationTable";
import { getUserWarehouses } from "@/lib/utils/GetUserWarehouse";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Relocation";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Relocation Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default async function Page() {
  const origin = await fetchTransferOriginWarehouseData();
  const originData = [{ value: null, label: "All Origin" }, ...origin];

  const data = await fetchTransferDestinationWarehouseData();
  const destinationData = [{ value: null, label: "All Destination" }, ...data];

  const warehouses =  await getUserWarehouses();

  return (
    <section className="table-wrapper">
      <RelocationTable
        originData={originData}
        destinationData={destinationData}
        warehouseData={warehouses}
      />
    </section>
  );
}
