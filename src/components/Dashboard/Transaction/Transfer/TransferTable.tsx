"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import { TransferTableHeader } from "./TransferTableHeader";
import { useAtomValue } from "jotai";
import { transferDataAtom } from "@/lib/atom";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import Link from "next/link";

interface TransferTableProps {
  originData: SelectBox[];
  destinationData: SelectBox[];
  warehouseData: SelectBox[];
}

export const TransferTable: React.FC<TransferTableProps> = ({
  originData,
  destinationData,
  warehouseData
}) => {
  const data = useAtomValue(transferDataAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } = useSortableData<TransferRecordDTO>(data);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <TransferTableHeader
        originOptions={originData}
        destinationOptions={destinationData}
        warehouseOptions={warehouseData}
      />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader
                title="Transfer ID"
                onSort={() => requestSort("transfer_id")}
              />
              <TableHeader
                title="Transfer Date"
                onSort={() => requestSort("transfer_date")}
              />
              <TableHeader
                title="Origin"
                onSort={() => requestSort("origin_warehouse")}
              />
              <TableHeader
                title="Destination"
                onSort={() => requestSort("destination_warehouse")}
              />
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Note</div>
              </th>
              <th scope="col" className="px-6 py-3" style={{ width: '30px' }}>
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
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {record.transfer_id}
                </th>
                <td className="px-6 py-4">
                  {new Date(record.transfer_date).toLocaleString()}
                </td>
                <td className="px-6 py-4">{record.origin_warehouse}</td>
                <td className="px-6 py-4">{record.destination_warehouse}</td>
                <td className="px-6 py-4">{record.note}</td>
                <td className="px-6 py-4 hover:cursor-pointer" style={{ width: '30px' }}>
                  <Link href={`transfer/${record.transfer_id}`}>
                    <Info color="#BCBCBC" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
