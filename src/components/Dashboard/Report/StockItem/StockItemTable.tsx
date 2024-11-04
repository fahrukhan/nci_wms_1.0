"use client";
import React from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import Link from "next/link";
import OutboundTablePagination from "./StockItemTablePagination";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";

interface StockItemTableProps {
  stockItemData: StockItemRecordDTO[];
}

export const StockItemTable: React.FC<StockItemTableProps> = ({
  stockItemData,
}) => {
  const { sortedData, requestSort } =
    useSortableData<StockItemRecordDTO>(stockItemData);

  return (
    <div>
      {/* <StockItemTableHeader /> */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} />
              <TableHeader
                title="Warehouse Name"
                onSort={() => requestSort("warehouse_name")}
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
                <TableCell>{record.warehouse_name}</TableCell>

                <TableCell>{record.count}</TableCell>
                <TableCell>
                  <Link
                    href={`stock-item/warehouse/${encodeURIComponent(
                      record.warehouse_name
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
      <OutboundTablePagination length={stockItemData.length} />
    </div>
  );
};
