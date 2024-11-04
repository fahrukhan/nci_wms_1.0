/**
 * @module Navbar
 * @description Navbar component yang menampilkan navigasi utama aplikasi.
 * @param {Object} props - Props yang diterima oleh komponen Navbar.
 * @param {Function} props.onCategorySelect - Callback function yang dipanggil ketika kategori dipilih.
 * @returns {JSX.Element} - Elemen JSX untuk Navbar.
 * 
 * Data Input:
 * - `navigation`: Array dari objek `NavigationItem` yang berisi detail navigasi.
 * - `pathname`: URL path saat ini yang diambil dari `usePathname` hook.

 * Komponen:
 * - `Navbar`: Menampilkan elemen navigasi utama.
 * - `CategoryNavbar`: Menampilkan sub-kategori navigasi jika ada.

 * Logic:
 * 1. Mengambil path saat ini menggunakan `usePathname` hook.
 * 2. Loop melalui setiap item di `navigation` array.
 * 3. Tentukan apakah item saat ini aktif atau tidak berdasarkan `pathname`.
 * 4. Jika item memiliki kategori, tampilkan tombol dengan dropdown, jika tidak, tampilkan link biasa.
 * 5. `CategoryNavbar` menampilkan sub-kategori jika `activeItem` memiliki kategori.
 */
"use client";

import {
  Cog6ToothIcon,
  DocumentChartBarIcon,
  InboxArrowDownIcon,
  RectangleGroupIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";
import { NavbarProps, NavigationItem } from "@/types/ui/navbar";

import { FC } from "react";
import { FaChevronDown } from "react-icons/fa";
import { usePathname } from "next/navigation";

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: RectangleGroupIcon,
    current: false,
  },
  {
    name: "Master Data",
    href: "/master",
    icon: ServerStackIcon,
    current: false,
    category: [
      "Attribute",
      "Category",
      "Customer",
      "Location",
      "Product",
      "Supplier",
      "Unit",
      "Warehouse",
    ],
  },
  {
    name: "Transaction",
    href: "/transaction",
    icon: InboxArrowDownIcon,
    current: false,
    category: ["Inbound", "Outbound", "Stock-Opname", "Relocation", "Transfer"],
  },
  {
    name: "Report",
    href: "/report",
    icon: DocumentChartBarIcon,
    current: false,
    category: ["Tag-Registration", "Current-Stock", "Tracking"],
  },
  {
    name: "User Management",
    href: "/user-management",
    icon: Cog6ToothIcon,
    current: false,
    category: ["Users", "Roles"],
  },
];

const Navbar: FC<NavbarProps> = ({ onCategorySelect }) => {
  const pathname = usePathname();

  return (
    <nav className="bg-white p-4">
      <div className="flex space-x-4">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return item.category ? (
            <button
              key={item.name}
              onClick={() => onCategorySelect(item)}
              className={`group flex items-center text-[12px] space-x-2 p-2 px-4 rounded-[30px] focus:outline-none ${
                isActive
                  ? "bg-[#2240B0] text-white shadow-md"
                  : "bg-white text-black hover:bg-gray-100"
              } focus:ring-2 focus:ring-gray-300`}
              autoFocus={isActive}
            >
              <item.icon
                className={`h-6 w-6 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
              <span className="lg:block hidden text-[12px]">{item.name}</span>
              <FaChevronDown
                className={`h-3 w-3 transition-transform ${
                  isActive ? "text-white rotate-0" : "text-gray-500 -rotate-90"
                } group-focus:rotate-0`}
              />
            </button>
          ) : (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center text-[12px] space-x-2 p-2 px-4 rounded-[30px] focus:outline-none ${
                isActive
                  ? "bg-[#2240B0] text-white shadow-md "
                  : "bg-white text-black hover:bg-gray-100"
              } focus:ring-2 focus:ring-gray-300`}
              autoFocus={isActive}
            >
              <item.icon
                className={`h-6 w-6 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
              <span className="lg:block hidden">{item.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
