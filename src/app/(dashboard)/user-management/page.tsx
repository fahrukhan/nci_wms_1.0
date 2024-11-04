import { redirect } from "next/navigation";

/**
 * Komponen halaman yang mengarahkan otomatis ke path anak pertama.
 *
 * Path utama (User-Management) memiliki path anak.
 * Saat pengguna mengakses path utama, mereka diarahkan ke path anak pertama.
 *
 * Contoh: Mengakses "/User-Management" diarahkan ke "/User-Management/users".
 */
const Page = () => {
  redirect("/user-management/users");
};

export default Page;
