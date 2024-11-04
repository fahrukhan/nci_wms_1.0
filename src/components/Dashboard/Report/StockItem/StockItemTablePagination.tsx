"use client";
import { TablePagination } from "@/components/TableComponent/TablePagination";
import { useState } from "react";

export default function StockItemTablePagination({
  length,
}: {
  length: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex justify-between mt-4 items-center">
      <div className="text-sm text-gray-500 mx-2">Total Data: {length}</div>
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(length / 10)} // Assuming 10 items per page
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
