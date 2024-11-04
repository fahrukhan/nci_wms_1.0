"use client";
import React, { useState }  from "react";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import Link from "next/link";
import OutboundTableHeader from "./OutboundTableHeader";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import { useAtomValue } from "jotai";
import { outboundDataAtom } from "@/lib/atom";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

export const OutboundTable = ({
  customerData,
  warehouseData,
}: {
  customerData: SelectBox[];
  warehouseData: SelectBox[];
}) => {
  const data = useAtomValue(outboundDataAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } = useSortableData<OutboundRecordDTO>(data);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <OutboundTableHeader customerOptions={customerData} warehouseOptions={warehouseData} />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader
                title="Outbound ID"
                onSort={() => requestSort("outbound_id")}
              />
              <TableHeader
                title="Outbound Date"
                onSort={() => requestSort("outbound_date")}
              />
              <TableHeader
                title="Customer Name"
                onSort={() => requestSort("customer_name")}
              />
              <TableHeader
                title="Admin Name"
                onSort={() => requestSort("admin_name")}
              />
              <TableHeader title="Ref" onSort={() => requestSort("ref")} />
              <TableHeader title="Detail" onSort={() => {}} style={{ width: '30px' }}/>
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell>{record.outbound_id}</TableCell>
                <TableCell>
                  {new Date(record.outbound_date).toLocaleString()}
                </TableCell>
                <TableCell>{record.customer_name}</TableCell>
                <TableCell>{record.admin_name}</TableCell>
                <TableCell>{record.ref}</TableCell>
                <TableCell style={{ width: '30px' }}>
                  <Link href={`outbound/${record.outbound_id}`}>
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
