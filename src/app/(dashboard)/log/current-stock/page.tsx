import type { Metadata } from "next";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { StockLocationTable } from "@/components/Dashboard/Report/StockLocation/StockLocationTable";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Stock Location";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Stock Location Report on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

async function fetchStockLocationData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/stock-current/warehouse`,
    {
      headers: await getHeaders(),
    }
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(
      errorResponse.status_message ||
        "An error occurred while fetching stock item data"
    );
  }

  return res.json();
}

export default async function Page() {
  let data;
  try {
    data = await fetchStockLocationData();
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return (
      <section className="table-wrapper">
        <div>Error: {errorMessage}</div>
      </section>
    );
  }

  return (
    <section className="table-wrapper">
      <StockLocationTable stockLocationData={data.data} />
    </section>
  );
}
