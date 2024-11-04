import "@/css/globals.css";

import BreadcrumbDynamic from "@/components/ui/breadcrumb";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import getUser from "@/lucia/getUser";
import { redirect } from "next/navigation";

const APP_NAME = "NCI WMS";
const APP_DEFAULT_TITLE = "NCI WMS";
const APP_TITLE_TEMPLATE = "%s - NCI WMS";
const APP_DESCRIPTION = "Application Warehouse Management System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

const ubuntu = Ubuntu({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default async function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <html lang="en" className={ubuntu.className}>
      <body className="flex flex-col bg-[#F7FBFF] h-screen">
        <DashboardLayout>
          <div className="bg-[#F7FBFF] w-full h-full p-4">
            <BreadcrumbDynamic />
            {children}
          </div>
        </DashboardLayout>
      </body>
    </html>
  );
}
