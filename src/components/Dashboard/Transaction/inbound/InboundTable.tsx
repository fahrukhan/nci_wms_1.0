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
import { inboundDataAtom } from "@/lib/atom";
import InboundTableHeader from "./InboundTableHeader";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

export const InboundTable = ({
  supplierData,
  warehouseData,
}: {
  supplierData: SelectBox[];
  warehouseData: SelectBox[];
}) => {
  const data = useAtomValue(inboundDataAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } = useSortableData<InboundRecordDTO>(data);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <InboundTableHeader supplierOptions={supplierData} warehouseOptions={warehouseData} />
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="table-head">
              <tr>
                <TableHeader
                  title="Inbound ID"
                  onSort={() => requestSort("inbound_id")}
                />
                <TableHeader
                  title="Inbound Date"
                  onSort={() => requestSort("inbound_date")}
                />
                <TableHeader
                  title="Supplier Name"
                  onSort={() => requestSort("supplier_name")}
                />
                <TableHeader
                  title="Admin Name"
                  onSort={() => requestSort("admin_name")}
                />
                <TableHeader
                  title="Ref"
                  onSort={() => requestSort("ref")}
                  style={{ width: "30px" }}
                />
                <th scope="col" className="px-6 py-3">
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
                  <TableCell>{record.inbound_id}</TableCell>
                  <TableCell>
                    {new Date(record.inbound_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{record.supplier_name}</TableCell>
                  <TableCell>{record.admin_name}</TableCell>
                  <TableCell>{record.ref}</TableCell>
                  <TableCell style={{ width: "30px" }}>
                    <Link href={`inbound/${record.inbound_id}`}>
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
