import { redirect } from "next/navigation";

/**
 * Komponen halaman yang mengarahkan otomatis ke path anak pertama.
 *
 * Path utama (Report) memiliki path anak.
 * Saat pengguna mengakses path utama, mereka diarahkan ke path anak pertama.
 *
 * Contoh: Mengakses "/Report" diarahkan ke "/Report/inbound".
 */
const Page = () => {
  redirect("/transaction/inbound");
};

export default Page;
