import type { Metadata } from "next";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { TagRegistrationTable } from "@/components/Dashboard/Report/TagRegistration/TagRegistrationTable";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "Tag Registration";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION =
  "Tag Registration Report User on Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

async function fetchTagRegistrationData(
  page: number,
  perPage: number,
  searchTerm: string
) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/tag-registration?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(
      errorResponse.status_message ||
        "An error occurred while fetching tag registration data"
    );
  }

  const result = await res.json();
  return { data: result.data, pagination: result.pagination };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  let data;
  try {
    data = await fetchTagRegistrationData(
      Number(searchParams.page) || 1,
      10,
      searchParams.search || ""
    );
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
      <TagRegistrationTable tagRegistrationData={data.data} />
    </section>
  );
}
