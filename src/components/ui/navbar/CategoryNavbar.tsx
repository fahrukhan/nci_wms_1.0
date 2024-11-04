/**
 * @module CategoryNavbar
 * @description CategoryNavbar component yang menampilkan navigasi sub-kategori jika ada.
 * @param {Object} props - Props yang diterima oleh komponen CategoryNavbar.
 * @param {Object} props.activeItem - Item navigasi yang aktif dan memiliki kategori.
 * @returns {JSX.Element} - Elemen JSX untuk CategoryNavbar.
 * 
 * Data Input:
 * - `activeItem`: Objek `NavigationItem` yang aktif dan berisi sub-kategori.
 * - `pathname`: URL path saat ini yang diambil dari `usePathname` hook.

 * Komponen:
 * - `CategoryNavbar`: Menampilkan elemen navigasi sub-kategori.

 * Logic:
 * 1. Mengambil path saat ini menggunakan `usePathname` hook.
 * 2. Loop melalui setiap sub-item di `category` array dari `activeItem`.
 * 3. Tentukan apakah sub-item saat ini aktif atau tidak berdasarkan `pathname`.
 * 4. Tampilkan link sub-item dengan style yang sesuai jika aktif atau tidak.
 */

import { CategoryNavbarProps } from "@/types/ui/navbar";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const CategoryNavbar: React.FC<CategoryNavbarProps> = ({ activeItem }) => {
  const pathname = usePathname();

  return (
    <>
      {activeItem?.category && (
        <div className="w-full bg-white shadow-sm">
          <div className="flex gap-3 pt-2 mx-auto w-fit">
            {activeItem.category.map((subItem: string) => {
              const subPath = `${activeItem.href}/${subItem.toLowerCase()}`;
              const isSubActive = pathname === subPath;
              return (
                <Link
                  key={subItem}
                  href={subPath}
                  className={`block p-1 text-[14px] ${
                    isSubActive
                      ? "font-bold text-[#17BA4E] pb-3 border-b-2 border-b-[#17BA4E]"
                      : "text-[#4e4d50] pb-3"
                  }`}
                >
                  {decodeURIComponent(subItem)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryNavbar;
