import "@/css/globals.css";

import { Inter, Roboto, Ubuntu, Ubuntu_Mono } from "next/font/google";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NCI WMS",
  description: "Login to Warehouse Management System",
};
const ubuntu = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ubuntu.className}>
      <body>{children}</body>
    </html>
  );
}
