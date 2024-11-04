import type { Metadata } from "next";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { TrackingTable } from "@/components/Dashboard/Report/Tracking/TrackingTable";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Tracking";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Tracking Report User on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};


export default async function Page() {
  return (
    <section className="table-wrapper">
      <TrackingTable initialTrackingData={[]}/>
    </section>
  );
}

