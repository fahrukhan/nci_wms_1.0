/* eslint-disable @next/next/no-img-element */

import { LoginForm } from "@/components/Login/LoginForm";
import Image from "next/image";

export default function Page() {
  return (
    <main className="h-screen w-screen flex">
      <div className=" bg-green-100 hidden md:block lg:flex-1">
        <img
          src="/warehouse-bg.webp"
          alt="Warehouse Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="h-full flex justify-center items-center">
          <div className="flex-1 p-32 flex-col justify-between">
            <div className="flex gap-2 mb-10 text-center items-center justify-center">
              <span className="text-3xl text-slate-800 font-semibold">
                RFID Warehouse
                <br />
                Management System
              </span>
            </div>
            <LoginForm />
            <div className="flex justify-center items-center gap-2 mt-20">
              <span className="text-xs text-gray-500">Powered by</span>
              <Image
                src="/wms_logo.webp"
                alt="Warehouse Management System"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
