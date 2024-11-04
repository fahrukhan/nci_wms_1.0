"use client";
import React, { useState } from "react";
import {
  TableHeader,
  TablePagination,
  useSortableData,
  TableInfoDetail,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import Link from "next/link";
import { Info } from "lucide-react";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

interface StockLocationTableProps {
  stockProductLocationData: StockProductLocationWarehouse;
  warehouseId: string;
}

export const StockProductLocationDetail: React.FC<StockLocationTableProps> = ({
  stockProductLocationData,
  warehouseId,
}) => {
  const { sortedData, requestSort } = useSortableData<LocationStockData>(
    stockProductLocationData.location_stock
  );
  const totalQty = stockProductLocationData.location_stock.reduce((sum, item) => sum + item.stock_qty, 0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      {/* <StockLocationTableHeader /> */}
      <div className="table-container-border">
        <div className="grid grid-cols-3 gap-32">
          <div className="flex flex-col">
            <TableInfoDetail title="Warehouse Name" value={stockProductLocationData.warehouse.name} />
            <TableInfoDetail title="Address" value={stockProductLocationData.warehouse.address} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Location"
              value={`${stockProductLocationData.location_stock.length}`}
            />
            <TableInfoDetail title="Total Item" value={`${totalQty}`} />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} />
              <TableHeader
                title="Location Name"
                onSort={() => requestSort("location_name")}
              />
              <TableHeader
                title="Location Path Name"
                onSort={() => requestSort("location_path_name")}
              />
              <TableHeader title="Stock" onSort={() => requestSort("stock_qty")} />

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
                <TableCell>{record.location_name}</TableCell>
                <TableCell>{record.location_path_name}</TableCell>

                <TableCell style={{width: '80px', textAlign: 'right'}}>{record.stock_qty}</TableCell>
                <TableCell style={{width: '150px'}}>
                  <Link className="flex justify-center"
                    href={`/report/current-stock/warehouse/${encodeURIComponent(warehouseId)}/location/${encodeURIComponent(
                      record.location_id
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
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
