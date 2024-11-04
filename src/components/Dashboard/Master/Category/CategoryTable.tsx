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
import { Category } from "@/drizzle/schema/MasterData/categories.schema";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchCategories } from "@/app/actions/categoryActions";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/exportExcel";

export const CategoryTable = ({
  initialData,
  initialPagination,
}: {
  initialData: Category[];
  initialPagination: {
    currentPage: number;
    totalItems: number;
    perPage: number;
  };
}) => {
  const [categoryData, setCategoryData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { sortedData, requestSort } = useSortableData<Category>(categoryData);

  const fetchData = useCallback(
    async (page: number, search: string) => {
      try {
        const { data, pagination } = await fetchCategories(
          page,
          initialPagination.perPage,
          search
        );
        setCategoryData(data);
        setPagination(pagination);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
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

  const categoriesColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Name", key: "name", width: 30 },
  ];
  const exportCategories = () => {
    exportToExcel(
      fetchCategories,
      categoriesColumns,
      "Category",
      pagination.totalItems
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <CategoryFormDialog />
        <Button
          onClick={exportCategories}
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
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <CategoryFormDialog category={record} isEdit />
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
