import { TransferTableDetail } from "@/components/Dashboard/Transaction/Transfer/detail/TransferTableDetail";
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

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

const fetchTransferDetails = async (id: string) => {
  const response = await fetch(`${process.env.BASE_URL}/transfer/detail/${id}`);
  const { data } = await response.json();
  return data;
};

export default async function Page({ params }: Readonly<PageProps>) {
  const { id } = params;
  const data = await fetchTransferDetails(id);
  return (
    <section className="table-wrapper">
      <TransferTableDetail data={data} />
    </section>
  );
}
