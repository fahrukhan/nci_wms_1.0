"use client";
import React, { useState } from "react";
import {
  TableHeader,
  TableInfoDetail,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";

interface OutboundDetail {
  outbound_id: string;
  outbound_date: string;
  customer_name: string;
  warehouse_name: string;
  admin_name: string;
  ref: string;
  note: string;
  detail: [
    {
      product_code: string;
      product_name: string;
      qty: number;
      unit_name: string;
    }
  ];
}

interface SortableTableProps {
  data: OutboundDetail;
}

export const OutboundTableDetail: React.FC<SortableTableProps> = ({ data }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const totalQty = data.detail.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <div className="mb-2 p-4 border-[1px] border-gray-400/20 bg-white shadow-sm rounded-md flex space-x-8">
        <div className="grid grid-cols-3 gap-32">
          <div className="flex flex-col">
            <TableInfoDetail title="Outbound Number" value={data.outbound_id} />
            <TableInfoDetail title="Outbound Date" value={data.outbound_date} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Item"
              value={`${data.detail.length}`}
            />
            <TableInfoDetail title="Total Qty" value={`${totalQty}`} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail title="Customer" value={data.customer_name} />
            <TableInfoDetail title="PIC" value={data.admin_name} />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300">
            <tr>
              <TableHeader title="No" onSort={() => {}} style={{ width: '15px' }}/>
              <TableHeader title="Product Code" onSort={() => {}} style={{ width: '150px' }}/>
              <TableHeader title="Product Name" onSort={() => {}} />
              <TableHeader title="QTY" onSort={() => {}} />
              <TableHeader title="Unit" onSort={() => {}} style={{ width: '100px' }}/>
            </tr>
          </thead>
          <tbody>
            {data.detail.map((record, index) => (
              <tr
                key={record.product_name}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 px-6 py-4"
              >
                <TableCell style={{ width: '15px' }}>{`${index + 1}`}</TableCell>
                <TableCell style={{ width: '150px' }}>{record.product_code}</TableCell>
                <TableCell>{record.product_name}</TableCell>
                <TableCell style={{ width: '80px', textAlign: 'right' }}>{`${record.qty}`}</TableCell>
                <TableCell style={{ width: '100px' }}>{record.unit_name}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4 items-center">
        <div className="text-sm text-gray-500 mx-2">
          Total Data: {data.detail.length}
        </div>
      </div>
    </div>
  );
};
