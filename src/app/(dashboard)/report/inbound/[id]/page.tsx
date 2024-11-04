import { InboundTableDetail } from "@/components/Dashboard/Transaction/Inbound/detail/InboundTableDetail";
import ReturnPageIcon from "@/components/Shared/ReturnPageIcon";
import { ChevronLeftIcon } from "lucide-react";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Inbound Detail";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION =
  "Inbound Detail Transaction on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

const fetchInboundDetails = async (id: string) => {
  const response = await fetch(`${process.env.BASE_URL}/inbound/detail/${id}`);
  const { data } = await response.json();
  return data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await fetchInboundDetails(id);
  return (
    <section className="table-wrapper">
      <InboundTableDetail data={data} />
    </section>
  );
}
