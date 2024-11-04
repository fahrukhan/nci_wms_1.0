import { redirect } from "next/navigation";

/**
 * Komponen halaman yang mengarahkan otomatis ke path anak pertama.
 *
 * Path utama (Input, Master, Report, User-Management) memiliki path anak.
 * Saat pengguna mengakses path utama, mereka diarahkan ke path anak pertama.
 *
 * Contoh: Mengakses "/master" diarahkan ke "/master/item".
 */
const Page = () => {
  redirect("/master/attribute");
};

export default Page;
