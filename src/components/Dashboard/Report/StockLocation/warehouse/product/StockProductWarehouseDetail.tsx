"use client";
import React, { useState } from "react";
import {
  TableHeader,
  TablePagination,
  useSortableData,
  TableInfoDetail,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import Image from "next/image";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

interface StockLocationTableProps {
  stockProductWarehouseData: StockProductWarehouse;
}

export const StockProductWarehouseDetail: React.FC<StockLocationTableProps> = ({
  stockProductWarehouseData
}) => {
  const { sortedData, requestSort } = useSortableData<AttributeStock>(
    stockProductWarehouseData.attribute_stock
  );

  const totalQty = stockProductWarehouseData.attribute_stock.reduce((sum, item) => sum + item.stock_qty, 0);

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
        <div className="grid grid-cols-2 gap-32">
          <div className="flex flex-col">
            <TableInfoDetail title="Warehouse Name" value={stockProductWarehouseData.warehouse.name} />
            <TableInfoDetail title="Address" value={stockProductWarehouseData.warehouse.address} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Product"
              value={`${stockProductWarehouseData.attribute_stock.length}`}
            />
            <TableInfoDetail title="Total Item" value={`${totalQty}`} />
          </div>
        </div>
      </div>
      <div className="table-container-border flex justify-center items-center">
        <div className="grid grid-cols-2 gap-12 justify-center items-center">
        <div className="flex flex-col items-center">
          <Image
            src={stockProductWarehouseData.product.image}
            alt="product image"
            width={200}
            height={400}
          />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail title="Product Name" value={stockProductWarehouseData.product.name} />
            <TableInfoDetail title="Product Code" value={stockProductWarehouseData.product.product_code} />
            <TableInfoDetail title="Qty Min" value={`${stockProductWarehouseData.product.qty_min}`} />
            <TableInfoDetail title="Qty Max" value={`${stockProductWarehouseData.product.qty_max}`} />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} />
              <TableHeader
                title="Attribute"
                onSort={() => requestSort("attribute")}
              />
              <TableHeader title="Stock" onSort={() => requestSort("stock_qty")} />
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell style={{width: '15px'}}>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{record.attribute}</TableCell>

                <TableCell style={{width: '80px', textAlign: 'right'}}>{record.stock_qty}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
