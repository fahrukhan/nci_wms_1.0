"use client";
import React, { useState } from "react";
import { Calendar as Info, InfoIcon } from "lucide-react";

import {
  useSortableData,
  TableHeader,
} from "@/components/TableComponent/TableComponent";
import Link from "next/link";
import TableCell from "@/components/TableComponent/TableCell";
import { useAtomValue } from "jotai";
import { stockOpnameProfileAtom } from "@/lib/atom";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import StockOpnameTableHeader from "./SOTableHeader";

export const StockOpnameTable = ({
  warehouseData,
}: {
  warehouseData: SelectBox[];
}) => {
  const data = useAtomValue(stockOpnameProfileAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } =
    useSortableData<StockOpnameProfileDTO>(data);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <StockOpnameTableHeader warehouseOptions={warehouseData} />
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="table-head">
              <tr>
                <TableHeader
                  title="Stock Opname Profile ID"
                  onSort={() => requestSort("stock_opname_profile_id")}
                />
                <TableHeader
                  title="Title"
                  onSort={() => requestSort("title")}
                />
                <TableHeader
                  title="Description"
                  onSort={() => requestSort("description")}
                />
                <TableHeader
                  title="Activity"
                  onSort={() => requestSort("activity")}
                  style={{ width: "50px" }}
                />

                <th scope="col" className="px-6 py-3" style={{ width: "30px" }}>
                  <div className="flex">Detail</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCell>{record.stock_opname_profile_id}</TableCell>
                  <TableCell>{record.title}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell style={{ width: "50px", textAlign: "right" }}>
                    {record.activity}
                  </TableCell>
                  <TableCell style={{ width: "30px" }}>
                    <Link
                      href={`/report/stock-opname/profile/${record.stock_opname_profile_id}`}
                    >
                      <InfoIcon color="#BCBCBC" />
                    </Link>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DefaultTablePagination
          item={itemsPerPage}
          length={sortedData.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
