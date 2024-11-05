import { OutboundTableDetail } from "@/components/Dashboard/Transaction/outbound/detail/OutboundTableDetail";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Outbound Detail";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION =
  "Outbound Detail Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

const fetchOutboundDetails = async (id: string) => {
  const response = await fetch(`${process.env.BASE_URL}/outbound/detail/${id}`);
  const { data } = await response.json();
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await fetchOutboundDetails(id);
  return (
    <section className="table-wrapper">
      <OutboundTableDetail data={data} />
    </section>
  );
}
