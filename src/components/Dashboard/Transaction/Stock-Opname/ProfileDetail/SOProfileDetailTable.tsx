"use client";
import React from "react";
import { Calendar as Info, InfoIcon } from "lucide-react";

import {
  useSortableData,
  TableHeader,
} from "@/components/TableComponent/TableComponent";
import Link from "next/link";
import TableCell from "@/components/TableComponent/TableCell";
import { useAtomValue } from "jotai";
import {
  stockOpnameProfileAtom,
  stockOpnameProfileDetailAtom,
} from "@/lib/atom";
import SOProfileDetailHeader from "./SOProfileDetailHeader";

export const SOProfileDetailTable = ({
  warehouseData,
  soProfileId,
}: {
  warehouseData: SelectBox[];
  soProfileId: string;
}) => {
  const data = useAtomValue(stockOpnameProfileDetailAtom);
  const { sortedData, requestSort } =
    useSortableData<StockOpnameProfileDetailDTO>(data);

  return (
    <div>
      <SOProfileDetailHeader
        warehouseOptions={warehouseData}
        soProfileId={soProfileId}
      />
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="table-head">
              <tr>
                <TableHeader
                  title="Stock Opname ID"
                  onSort={() => requestSort("stock_opname_id")}
                />
                <TableHeader
                  title="Date"
                  onSort={() => requestSort("stock_opname_date")}
                />
                <TableHeader
                  title="Location"
                  onSort={() => requestSort("location_name")}
                />
                <TableHeader
                  title="Total Stock"
                  onSort={() => requestSort("quantity")}
                />

                <TableHeader
                  title="User"
                  onSort={() => requestSort("user_name")}
                />

                <th scope="col" className="px-6 py-3" style={{ width: "30px" }}>
                  <div className="flex">Detail</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCell>{record.stock_opname_id}</TableCell>
                  <TableCell>
                    {new Date(record.stock_opname_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{record.location_name}</TableCell>
                  <TableCell style={{ width: "80px", textAlign: "right" }}>
                    {record.quantity}
                  </TableCell>
                  <TableCell>{record.user_name}</TableCell>
                  <TableCell style={{ width: "30px" }}>
                    <Link href={""}>
                      {/* <Link href={`inbound/${record.inbound_id}`}> */}
                      <InfoIcon color="#BCBCBC" />
                    </Link>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
