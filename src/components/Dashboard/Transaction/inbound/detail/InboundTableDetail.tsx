"use client";
import React from "react";
import {
  TableHeader,
  TableInfoDetail,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";

interface SortableTableProps {
  data: InboundDetailDTO;
}

export const InboundTableDetail: React.FC<SortableTableProps> = ({ data }) => {
  const totalQty = data.detail.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <div className="table-container-border">
        <div className="grid grid-cols-3 gap-32">
          <div className="flex flex-col">
            <TableInfoDetail title="Inbound Number" value={data.inbound_id} />
            <TableInfoDetail title="Inbound Date" value={data.inbound_date} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Item"
              value={`${data.detail.length}`}
            />
            <TableInfoDetail title="Total Qty" value={`${totalQty}`} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail title="Vendor" value={data.supplier_name} />
            <TableInfoDetail title="PIC" value={data.admin_name} />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="table-head">
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
