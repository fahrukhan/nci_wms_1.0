/**
 * @module BreadcrumbDynamic
 * @description BreadcrumbDynamic
 * Komponen ini digunakan untuk menampilkan breadcrumb dinamis berdasarkan path yang ada.
 * Breadcrumb ini menunjukkan hierarki navigasi dari path URL yang sedang diakses.
 *
 * Tool:
 * @see https://nextjs.org/docs/app/api-reference/functions/use-pathname
 *
 * Data Input:
 * - Tidak ada input langsung, namun komponen ini memanfaatkan hook `usePathname` dari Next.js untuk mendapatkan path URL saat ini.
 *
 *
 * Overview Komponen:
 * 1. formatName - Fungsi untuk memformat nama path agar lebih mudah dibaca.
 * 2. BreadcrumbDynamic - Komponen utama yang mengolah path URL menjadi breadcrumb.
 *
 * Logic:
 * 1. Menggunakan `usePathname` untuk mendapatkan path URL saat ini.
 * 2. Memisahkan path URL berdasarkan '/' dan menyaring bagian yang kosong.
 * 3. Menentukan judul berdasarkan path terakhir, jika ada path, menggunakan fungsi `formatName`.
 * 4. Menghasilkan elemen breadcrumb untuk setiap bagian path, dengan bagian terakhir menjadi judul.
 * 5. Menampilkan breadcrumb dalam sebuah <div> dengan gaya yang telah ditentukan.
 *
 * Contoh:
 * Jika URL saat ini adalah `/dashboard/settings/profile`, maka breadcrumb yang dihasilkan adalah:
 * Home > Dashboard > Settings > Profile
 */

"use client";

import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getHeaders } from "@/lib/utils/GetHeaders";

const formatName = (s: string) => {
  return s
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const BreadcrumbDynamic = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);
  const [warehouseName, setWarehouseName] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouseName = async (warehouseId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/warehouse`, {
          headers: await getHeaders(),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const warehouse = data.data.find((warehouse: any) => warehouse.warehouse_id === parseInt(warehouseId));
        if (warehouse) {
          setWarehouseName(warehouse.name);
        } else {
          setWarehouseName(null);
        }
      } catch (error) {
        setWarehouseName(null);
      }
    };

    const fetchProductName = async (productId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}`, {
          headers: await getHeaders(),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProductName(data.data.name);
      } catch (error) {
        setProductName(null);
      }
    };

    const fetchLocationName = async (locationId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/location`, {
          headers: await getHeaders(),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const location = data.data.find((location: any) => location.location_id === parseInt(locationId));
        if (location) {
          setWarehouseName(location.name);
        } else {
          setWarehouseName(null);
        }
      } catch (error) {
        setLocationName(null);
      }
    };

    if (pathnames.length == 4 && pathnames[0] === "report" && pathnames[1] === "current-stock" && pathnames[2] === "warehouse") {
      const lastSegment = pathnames[pathnames.length - 1];
      if (!isNaN(parseInt(lastSegment))) {
        fetchWarehouseName(lastSegment);
      } else {
        setWarehouseName(null);
      }
    } else {
      setWarehouseName(null);
    }

    if (pathnames.length == 5 && pathnames[0] === "report" && pathnames[1] === "current-stock" && pathnames[2] === "warehouse" && !isNaN(parseInt(pathnames[pathnames.length - 1]))) {
      fetchProductName(pathnames[pathnames.length - 1]);
      fetchWarehouseName(pathnames[pathnames.length - 2]);
    } else {
      setProductName(null);
    }

    if (pathnames.length == 6 && pathnames[0] === "report" && pathnames[1] === "current-stock" && pathnames[2] === "warehouse" && pathnames[4] === "location") {
      fetchLocationName(pathnames[pathnames.length - 1]);
    } else {
      setLocationName(null);
    }

  }, [pathname]);

  // Determine the title based on the path
  let title = "Dashboard";

  if (pathnames.length > 0) {
    const lastPath = pathnames[pathnames.length - 1];
    if (warehouseName && productName){
      title = productName
    } else {
      title = warehouseName || locationName || formatName(decodeURIComponent(lastPath));
    }
    
    
  }

  if (pathnames[1] === "inbound" && pathnames.length > 2) {
    title = "Inbound Detail";
  }

  if (pathnames[1] === "outbound" && pathnames.length > 2) {
    title = "Outbound Detail";
  }

  if (pathnames[1] === "relocation" && pathnames.length > 2) {
    title = "Relocation Detail";
  }

  if (pathnames[1] === "transfer" && pathnames.length > 2) {
    title = "Transfer Detail";
  }

  return (
    <div className="border-b-1 border-t-0 border-r-0 border-l-0 flex justify-between border border-stroke py-3 dark:border-strokedark dark:bg-meta-4 sm:py-5.5 xl:px-7.5">
      <h1 className="text-xl">{decodeURIComponent(title)}</h1>

      <nav>
        <ol className="flex flex-wrap items-center gap-3">
          <li>
            <Link
              className="flex items-center gap-2 font-medium text-gray-500 hover:text-primary"
              href="/"
            >
              <svg
                className="fill-current"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3503 14.6504H10.2162C9.51976 14.6504 8.93937 14.0698 8.93937 13.373V10.8183C8.93937 10.5629 8.73043 10.3538 8.47505 10.3538H6.54816C6.29279 10.3538 6.08385 10.5629 6.08385 10.8183V13.3498C6.08385 14.0465 5.50346 14.6272 4.80699 14.6272H1.62646C0.929989 14.6272 0.349599 14.0465 0.349599 13.3498V5.24444C0.349599 4.89607 0.535324 4.57092 0.837127 4.38513L6.96604 0.506623C7.29106 0.297602 7.73216 0.297602 8.05717 0.506623L14.1861 4.38513C14.4879 4.57092 14.6504 4.89607 14.6504 5.24444V13.3266C14.6504 14.0698 14.07 14.6504 13.3503 14.6504ZM6.52495 9.54098H8.45184C9.14831 9.54098 9.7287 10.1216 9.7287 10.8183V13.3498C9.7287 13.6053 9.93764 13.8143 10.193 13.8143H13.3503C13.6057 13.8143 13.8146 13.6053 13.8146 13.3498V5.26766C13.8146 5.19799 13.7682 5.12831 13.7218 5.08186L7.61608 1.20336C7.54643 1.15691 7.45357 1.15691 7.40714 1.20336L1.27822 5.08186C1.20858 5.12831 1.18536 5.19799 1.18536 5.26766V13.373C1.18536 13.6285 1.3943 13.8375 1.64967 13.8375H4.80699C5.06236 13.8375 5.2713 13.6285 5.2713 13.373V10.8183C5.24809 10.1216 5.82848 9.54098 6.52495 9.54098Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.51145 1.55118L13.465 5.33306V13.3498C13.465 13.4121 13.4126 13.4646 13.3503 13.4646H10.193C10.1307 13.4646 10.0783 13.4121 10.0783 13.3498V10.8183C10.0783 9.92844 9.34138 9.19125 8.45184 9.19125H6.52495C5.63986 9.19125 4.89529 9.92534 4.9217 10.8238V13.373C4.9217 13.4354 4.86929 13.4878 4.80699 13.4878H1.64967C1.58738 13.4878 1.53496 13.4354 1.53496 13.373V5.33323L7.51145 1.55118ZM1.27822 5.08186L7.40714 1.20336C7.45357 1.15691 7.54643 1.15691 7.61608 1.20336L13.7218 5.08186C13.7682 5.12831 13.8146 5.19799 13.8146 5.26766V13.3498C13.8146 13.6053 13.6057 13.8143 13.3503 13.8143H10.193C9.93764 13.8143 9.7287 13.6053 9.7287 13.3498V10.8183C9.7287 10.1216 9.14831 9.54098 8.45184 9.54098H6.52495C5.82848 9.54098 5.24809 10.1216 5.2713 10.8183V13.373C5.2713 13.6285 5.06236 13.8375 4.80699 13.8375H1.64967C1.3943 13.8375 1.18536 13.6285 1.18536 13.373V5.26766C1.18536 5.19799 1.20858 5.12831 1.27822 5.08186ZM13.3503 15.0001H10.2162C9.32668 15.0001 8.58977 14.2629 8.58977 13.373V10.8183C8.58977 10.756 8.53735 10.7036 8.47505 10.7036H6.54816C6.48587 10.7036 6.43345 10.756 6.43345 10.8183V13.3498C6.43345 14.2397 5.69654 14.9769 4.80699 14.9769H1.62646C0.736911 14.9769 0 14.2397 0 13.3498V5.24444C0 4.77143 0.251303 4.33603 0.651944 4.08848L6.77814 0.211698C7.21781 -0.0704034 7.80541 -0.0704031 8.24508 0.211698C8.24546 0.211943 8.24584 0.212188 8.24622 0.212433L14.3713 4.08851C14.7853 4.34436 15 4.78771 15 5.24444V13.3266C15 14.2589 14.2671 15.0001 13.3503 15.0001ZM14.1861 4.38513L8.05717 0.506623C7.73216 0.297602 7.29106 0.297602 6.96604 0.506623L0.837127 4.38513C0.535324 4.57092 0.349599 4.89607 0.349599 5.24444V13.3498C0.349599 14.0465 0.929989 14.6272 1.62646 14.6272H4.80699C5.50346 14.6272 6.08385 14.0465 6.08385 13.3498V10.8183C6.08385 10.5629 6.29279 10.3538 6.54816 10.3538H8.47505C8.73043 10.3538 8.93937 10.5629 8.93937 10.8183V13.373C8.93937 14.0698 9.51976 14.6504 10.2162 14.6504H13.3503C14.07 14.6504 14.6504 14.0698 14.6504 13.3266V5.24444C14.6504 4.89607 14.4879 4.57092 14.1861 4.38513Z"
                  fill=""
                />
              </svg>
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            let displayName = isLast ? (warehouseName || productName || formatName(decodeURIComponent(name))) : formatName(decodeURIComponent(name));
            if (warehouseName && productName) {
              displayName = isLast ? productName : formatName(decodeURIComponent(name))
            }
            
            return isLast ? (
              <li
                key={name}
                className="text-[#2240B0] font-bold flex items-center gap-3"
              >
                <FaChevronRight className="h-3 text-gray-500 w-3" />
                <span> {displayName}</span>
              </li>
            ) : (
              <li
                key={name}
                className="flex text-gray-500 items-center gap-3 font-medium"
              >
                <FaChevronRight className="h-3 text-gray-500 w-3" />
                <Link href={routeTo} className="hover:text-primary">
                {displayName}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbDynamic;
