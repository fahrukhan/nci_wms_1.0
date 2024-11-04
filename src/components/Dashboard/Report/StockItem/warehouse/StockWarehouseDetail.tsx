"use client";
import React from "react";
import {
  TableHeader,
  TablePagination,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import Link from "next/link";
import { Info } from "lucide-react";

interface StockItemTableProps {
  stockWarehouseData: StockWarehouseData;
  warehouseName: string;
}

export const StockWarehouseDetail: React.FC<StockItemTableProps> = ({
  stockWarehouseData,
  warehouseName,
}) => {
  const { sortedData, requestSort } = useSortableData<StockProductData>(
    stockWarehouseData.items
  );

  return (
    <div>
      {/* <StockItemTableHeader /> */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} />
              <TableHeader
                title="Product Name"
                onSort={() => requestSort("products_name")}
              />
              <TableHeader title="Stock" onSort={() => requestSort("count")} />

              <TableHeader title="Detail" onSort={() => {}} />
            </tr>
          </thead>
          <tbody>
            {sortedData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{record.products_name}</TableCell>

                <TableCell>{record.count}</TableCell>
                <TableCell>
                  <Link
                    href={`/report/stock-item/warehouse/${warehouseName}?productName=${encodeURIComponent(
                      record.products_name
                    )}`}
                  >
                    <Info color="#BCBCBC" />
                  </Link>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4 items-center">
        <div className="flex gap-8">
          <div className="text-sm text-gray-500 mx-2">
            Total Produk : {stockWarehouseData.items.length}
          </div>
          <div className="text-sm text-gray-500 mx-2">
            Total Stock : {stockWarehouseData.totalQty}
          </div>
        </div>
        <TablePagination
          currentPage={1}
          totalPages={Math.ceil(10 / 10)}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
};
