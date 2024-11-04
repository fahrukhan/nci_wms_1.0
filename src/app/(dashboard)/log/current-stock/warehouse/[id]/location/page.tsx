import { StockProductLocationDetail } from "@/components/Dashboard/Report/StockLocation/warehouse/StockProductLocationDetail";
import { StockWarehouseLocationDetail } from "@/components/Dashboard/Report/StockLocation/warehouse/StockWarehouseLocationDetail";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Warehouse Stock";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Warehouse Stock Detail on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

const fetchWarehouseStock = async (id: string) => {
  let url = `${process.env.BASE_URL}/stock-current/warehouse/${id}/location`;

  const response = await fetch(url);
  const { data } = await response.json();
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const decodedName = decodeURIComponent(params.id);
  const data = await fetchWarehouseStock(decodedName);

  return (
    <section className="table-wrapper">
      <StockProductLocationDetail
        stockProductLocationData={data}
        warehouseId={decodedName}
      />
    </section>
  );
}
