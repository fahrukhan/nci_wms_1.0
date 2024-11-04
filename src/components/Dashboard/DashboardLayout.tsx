"use client";

import React, { useState } from "react";

import Bell from "@/components/Icons/Bell";
import CategoryNavbar from "@/components/ui/navbar/CategoryNavbar";
import ChevronDown from "@/components/Icons/ChevronDown";
import Image from "next/image";
// import Navbar from "@/components/ui/navbar/navbar";
import Warehouse from "@/components/Icons/warehoues";
import Link from "next/link";
import { LogoutDialog } from "../Login/LogoutModal";
import { NewNavbar } from "../ui/navbar/NewNavbar";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategorySelect = (item: any) => {
    setActiveCategory(item);
  };

  return (
    <>
      <header className="flex items-center bg-white align-middle justify-between px-8 py-2 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              width={200}
              height={41}
              src="/wms_logo.webp"
              className="hidden lg:block"
              alt="Warehouse Management System"
            />
          </Link>
          <Warehouse className="h-12 block lg:hidden w-12" />
        </div>
        <NewNavbar />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="rounded-full border-gray-200 border-2 p-2">
              <Bell />
            </div>
            <LogoutDialog>
              <div className="rounded-full border-gray-200 border-2 p-2 flex gap-4">
                <Image
                  src="data:image/png;base64,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"
                  className="rounded-full"
                  width="24"
                  height="26"
                  alt="gambar user"
                />

                <ChevronDown />
              </div>
            </LogoutDialog>
          </div>
        </div>
      </header>
      {activeCategory && <CategoryNavbar activeItem={activeCategory} />}
      <main className="flex w-full md:px-8 lg:px-12 flex-1 mt-2">
        {children}
      </main>
    </>
  );
}
