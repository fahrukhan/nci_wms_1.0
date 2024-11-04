"use client";
import React, { useCallback, useState } from "react";
import { Search } from "lucide-react";
import {
  useSortableData,
  TableHeader,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import { Input } from "@/components/ui/input";
import { Warehouse } from "@/drizzle/schema/MasterData/warehouses.schema";
import { WarehouseFormDialog } from "./WarehouseFormDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWarehouse } from "@/app/actions/warehouseActions";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/exportExcel";

export const WarehouseTable = ({
  initialData,
  initialPagination,
}: {
  initialData: Warehouse[];
  initialPagination: {
    currentPage: number;
    totalItems: number;
    perPage: number;
  };
}) => {
  const [warehouseData, setWarehouseData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const { sortedData, requestSort } = useSortableData<Warehouse>(warehouseData);

  const router = useRouter();

  const fetchData = useCallback(
    async (page: number, search: string) => {
      try {
        const { data, pagination } = await fetchWarehouse(
          page,
          initialPagination.perPage,
          search
        );
        setWarehouseData(data);
        setPagination(pagination);
      } catch (error) {
        console.error("Failed to fetch warehouse:", error);
      }
    },
    [initialPagination.perPage]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    router.push(`?page=1&search=${encodeURIComponent(newSearchTerm)}`);
    fetchData(1, newSearchTerm);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}&search=${encodeURIComponent(searchTerm)}`);
    fetchData(newPage, searchTerm);
  };

  const warehouseColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Name", key: "name", width: 30 },
    { header: "Address", key: "address", width: 30 },
    { header: "Phone", key: "phone", width: 30 },
  ];
  const exportWarehouses = () => {
    exportToExcel(
      fetchWarehouse,
      warehouseColumns,
      "Warehouse",
      pagination.totalItems
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <WarehouseFormDialog />
        <Button
          onClick={exportWarehouses}
          variant="default"
          className="bg-emerald-700"
        >
          Export to Excel
        </Button>
      </div>
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="table-head">
              <tr>
                <TableHeader
                  title="No."
                  sortable={false}
                  style={{ width: "15px" }}
                />
                <TableHeader title="Name" onSort={() => requestSort("name")} />
                <TableHeader title="Phone" sortable={false} />
                <TableHeader title="Address" sortable={false} />

                <TableHeader
                  title="Edit"
                  sortable={false}
                  style={{ width: "30px" }}
                />
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCell style={{ width: "15px" }}>
                    {(pagination.currentPage - 1) * pagination.perPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell>{record.address}</TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <WarehouseFormDialog warehouse={record} isEdit />
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DefaultTablePagination
        item={pagination.perPage}
        length={pagination.totalItems}
        currentPage={pagination.currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
