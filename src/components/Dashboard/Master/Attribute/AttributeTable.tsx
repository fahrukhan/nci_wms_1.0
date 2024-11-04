"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AttributeFormDialog } from "@/components/Dashboard/Master/Attribute/AttributeFormDialog";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import { fetchAttributes } from "@/app/actions/attributeActions";
import { Attribute } from "@/drizzle/schema/MasterData/attributes.schema";
import { useSortableData } from "@/components/TableComponent/useSortableData";
import TableCell from "@/components/TableComponent/TableCell";
import { TableHeader } from "@/components/TableComponent/TableHeader";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/exportExcel";

export const AttributeTable = ({
  initialData,
  initialPagination,
}: {
  initialData: Attribute[];
  initialPagination: {
    currentPage: number;
    totalItems: number;
    perPage: number;
  };
}) => {
  const [attributes, setAttributes] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { sortedData, requestSort } = useSortableData<Attribute>(attributes);

  const fetchData = useCallback(
    async (page: number, search: string) => {
      try {
        const { data, pagination } = await fetchAttributes(
          page,
          initialPagination.perPage,
          search
        );
        setAttributes(data);
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

  const attributeColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Name", key: "name", width: 30 },
    { header: "Type", key: "type", width: 20 },
    { header: "List", key: "list", width: 20 },
  ];
  const exportAttributes = () => {
    exportToExcel(
      fetchAttributes,
      attributeColumns,
      "Attributes",
      pagination.totalItems
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search attributes..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <AttributeFormDialog />
        <Button
          onClick={exportAttributes}
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
                <TableHeader title="Type" onSort={() => requestSort("type")} />
                <TableHeader title="List" onSort={() => requestSort("list")} />
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
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.list}</TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <AttributeFormDialog attribute={record} isEdit />
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
