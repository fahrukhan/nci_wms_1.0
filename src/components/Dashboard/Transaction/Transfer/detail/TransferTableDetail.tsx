"use client";
import React, { useState } from "react";
import {
  TableHeader,
  TableInfoDetail,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import { request } from "http";

interface SortableTableProps {
  data: TransferDetailDTO;
}

export const TransferTableDetail: React.FC<SortableTableProps> = ({ data }) => {
  const totalQty = data.detail.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <div className="table-container-border">
        <div className="grid grid-cols-3 gap-32">
          <div className="flex flex-col">
            <TableInfoDetail title="Transfer Number" value={data.transfer_id} />
            <TableInfoDetail title="Transfer Date" value={data.transfer_date} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Item"
              value={`${data.detail.length}`}
            />
            <TableInfoDetail title="Total Qty" value={`${totalQty}`} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail title="Origin" value={data.origin_name} />
            <TableInfoDetail
              title="Destination"
              value={data.destination_name}
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="table-head">
            <tr>
              <TableHeader title="No" sortable={false} style={{ width: '15px'}}/>
              <TableHeader title="Product Code" sortable={false} style={{ width: '150px'}}/>
              <TableHeader title="Product Name" sortable={false} />
              <TableHeader title="QTY" sortable={false} />
              <TableHeader title="Unit" sortable={false} style={{ width: '100px'}}/>
            </tr>
          </thead>
          <tbody>
            {data.detail.map((record, index) => (
              <tr
                key={record.product_name}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 px-6 py-4"
              >
                <TableCell style={{ width: '15px'}}>{`${index + 1}`}</TableCell>
                <TableCell style={{ width: '150px'}}>{record.product_code}</TableCell>
                <TableCell>{record.product_name}</TableCell>
                <TableCell style={{ width: '80px', textAlign: 'right' }}>{`${record.qty}`}</TableCell>
                <TableCell style={{ width: '100px'}}>{record.unit_name}</TableCell>
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
