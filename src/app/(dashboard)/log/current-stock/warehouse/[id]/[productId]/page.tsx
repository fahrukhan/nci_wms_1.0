import { StockProductWarehouseDetail } from "@/components/Dashboard/Report/StockLocation/warehouse/product/StockProductWarehouseDetail";
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

const fetchProductWarehouseStock = async (id: string, productId: string) => {
  let url = `${process.env.BASE_URL}/stock-current/warehouse/${id}/product/${productId}`;

  const response = await fetch(url);
  const { data } = await response.json();
  return data;
};

export default async function Page({
  params,
}: {
  params: { id: string, productId: string };
}) {
  const decodedWarehouse = decodeURIComponent(params.id);
  const decodedProduct = decodeURIComponent(params.productId);
  const data = await fetchProductWarehouseStock(decodedWarehouse, decodedProduct);

  return (
    <section className="table-wrapper">
      <StockProductWarehouseDetail
        stockProductWarehouseData={data}
      />
    </section>
  );
}
