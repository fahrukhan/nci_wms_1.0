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
  stockLocationWarehouseData: StockLocationWarehouse;
  warehouseId: string;
}

export const StockWarehouseLocationDetail: React.FC<StockLocationTableProps> = ({
  stockLocationWarehouseData,
  warehouseId,
}) => {
  const { sortedData, requestSort } = useSortableData<ProductStockData>(
    stockLocationWarehouseData.product_stock
  );

  const totalQty = stockLocationWarehouseData.product_stock.reduce((sum, item) => sum + item.stock_qty, 0);

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
            <TableInfoDetail title="Warehouse Name" value={stockLocationWarehouseData.warehouse.name} />
            <TableInfoDetail title="Address" value={stockLocationWarehouseData.warehouse.address} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Product"
              value={`${stockLocationWarehouseData.product_stock.length}`}
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
                title="Product Name"
                onSort={() => requestSort("product_name")}
              />
              <TableHeader title="Stock" onSort={() => requestSort("stock_qty")} />

              <TableHeader title="Product Detail" onSort={() => {}} />
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell style={{width: '15px'}}>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{record.product_name}</TableCell>

                <TableCell style={{width: '80px', textAlign: 'right'}}>{record.stock_qty}</TableCell>
                <TableCell style={{width: '180px'}}>
                  <Link className="flex justify-center"
                    href={`/report/current-stock/warehouse/${encodeURIComponent(warehouseId)}/${encodeURIComponent(
                      record.product_id
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
