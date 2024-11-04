"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import Link from "next/link";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

interface StockLocationTableProps {
  stockLocationData: StockLocationRecordDTO[];
}

export const StockLocationTable: React.FC<StockLocationTableProps> = ({
  stockLocationData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } =
    useSortableData<StockLocationRecordDTO>(stockLocationData);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* <StockLocationTableHeader /> */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} style={{width: '15px'}}/>
              <TableHeader
                title="Warehouse Name"
                onSort={() => requestSort("warehouse_name")}
              />
              <TableHeader title="Stock" onSort={() => requestSort("stock_qty")} />

              <TableHeader title="Product Detail" sortable={false} />
              <TableHeader title="Location Detail" sortable={false} />
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell style={{width: '15px'}}>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{record.warehouse_name}</TableCell>

                <TableCell style={{width: '80px', textAlign: 'right'}}>{record.stock_qty}</TableCell>
                <TableCell style={{width: '150px'}}>
                  <Link className="flex justify-center"
                    href={`current-stock/warehouse/${encodeURIComponent(
                      record.warehouse_id
                    )}`}
                  >
                    <Info color="#BCBCBC" />
                  </Link>
                </TableCell>
                <TableCell style={{width: '150px'}}>
                  <Link className="flex justify-center"
                    href={`current-stock/warehouse/${encodeURIComponent(
                      record.warehouse_id
                    )}/location`}
                  >
                    <Info color="#BCBCBC" />
                  </Link>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
