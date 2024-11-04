"use client";

/**
 * Dynamic Import
 * https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
 */

import { LoadingComponent } from "@/components/ui/loader/loader1";
import React from "react";
import dynamic from "next/dynamic";

/**
 * Komponen dinamis untuk memuat DonutChart dengan dukungan server-side rendering dinonaktifkan.
 * Menampilkan komponen LoadingComponent selama proses pemuatan.
 */
const DonutChart = dynamic(
  () =>
    import("@/components/ui/Chart/DonutChart"),
  {
    ssr: false,
    loading: () => <LoadingComponent />,
  }
);

/**
 * Komponen dinamis untuk memuat InboundOutboundChart dengan dukungan server-side rendering dinonaktifkan.
 * Menampilkan komponen LoadingComponent selama proses pemuatan.
 */
const InboundOutboundChart = dynamic(
  () =>
    import("@/components/ui/Chart/InboundOutboundChart"),
  {
    ssr: false,
    loading: () => <LoadingComponent />,
  }
);

/**
 * Komponen Dashboard menampilkan dua grafik: InboundOutboundChart dan DonutChart.
 * Masing-masing grafik diatur dalam layout grid yang responsif.
 * @returns {JSX.Element} - Elemen JSX yang mewakili komponen Dashboard.
 */
export const Dashboard: React.FC = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12 2xl:gap-7.5">
      <div className="col-span-12 lg:col-span-7">
        <InboundOutboundChart />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <DonutChart />
      </div>
    </section>
  );
};
