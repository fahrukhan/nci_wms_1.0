import { StockWarehouseDetail } from "@/components/Dashboard/Report/StockItem/warehouse/StockWarehouseDetail";
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

const fetchWarehouseStock = async (name: string, productName?: string) => {
  let url = `${process.env.BASE_URL}/stock-item/warehouse/${name}`;

  if (productName) {
    url += `?productName=${encodeURIComponent(productName)}`;
  }

  const response = await fetch(url);
  const { data } = await response.json();
  return data;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { productName?: string };
}) {
  const decodedName = decodeURIComponent(params.name);
  const productName = searchParams.productName;
  const data = await fetchWarehouseStock(decodedName, productName);

  return (
    <section className="table-wrapper">
      <StockWarehouseDetail
        stockWarehouseData={data}
        warehouseName={decodedName}
      />
    </section>
  );
}
