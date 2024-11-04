"use client";
import React, { useState } from "react";
import {
  TableHeader,
  TablePagination,
  useSortableData,
  TableInfoDetail,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

interface StockLocationTableProps {
  stockLocationProductDetail: StockLocationProduct;
}

export const StockLocationProductDetail: React.FC<StockLocationTableProps> = ({
  stockLocationProductDetail
}) => {
  const { sortedData, requestSort } = useSortableData<ProductStockData>(
    stockLocationProductDetail.product_stock
  );
  const totalQty = stockLocationProductDetail.product_stock.reduce((sum, item) => sum + item.stock_qty, 0);

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
        <div className="grid grid-cols-3 gap-16">
          <div className="flex flex-col">
            <TableInfoDetail title="Warehouse Name" value={stockLocationProductDetail.warehouse.name} />
            <TableInfoDetail title="Address" value={stockLocationProductDetail.warehouse.address} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail
              title="Total Product"
              value={`${stockLocationProductDetail.product_stock.length}`}
            />
            <TableInfoDetail title="Total Item" value={`${totalQty}`} />
          </div>
          <div className="flex flex-col">
            <TableInfoDetail title="Location Name" value={`${stockLocationProductDetail.location.location_name}`} />
            <TableInfoDetail title="Location Path Name" value={stockLocationProductDetail.location.location_path_name} />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
