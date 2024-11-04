import { RelocationTableDetail } from "@/components/Dashboard/Transaction/Relocation/detail/RelocationTableDetail";
import type { Metadata } from "next";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Relocation Detail";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION =
  "Relocation Detail Transaction on Warehouse Management System";

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

const fetchRelocationId = async (id: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/relocation/detail/${id}`,
    {
      cache: "no-store",
    }
  );
  const { data } = await response.json();
  return data;
};

export default async function Page({ params }: Readonly<PageProps>) {
  const { id } = params;
  const data = await fetchRelocationId(id);

  return (
    <section className="table-wrapper">
      <RelocationTableDetail data={data} />
    </section>
  );
}
