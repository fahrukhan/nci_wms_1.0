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
import { Contact } from "@/drizzle/schema/MasterData/contacts.schema";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { fetchCustomer } from "@/app/actions/contactActions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/exportExcel";

interface CustomerTableProps {
  isSupplier?: boolean;
  initialData: Contact[];
  initialPagination: {
    currentPage: number;
    totalItems: number;
    perPage: number;
  };
}

export const CustomerTable = ({
  initialData,
  initialPagination,
  isSupplier,
}: CustomerTableProps) => {
  const [contactData, setContactData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { sortedData, requestSort } = useSortableData<Contact>(contactData);

  const fetchData = useCallback(
    async (page: number, search: string) => {
      try {
        const { data, pagination } = await fetchCustomer(
          page,
          initialPagination.perPage,
          search
        );
        setContactData(data);
        setPagination(pagination);
      } catch (error) {
        console.error("Failed to fetch contact:", error);
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

  const customerColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Name", key: "name", width: 30 },
    { header: "Address", key: "address", width: 30 },
    { header: "Phone Number", key: "phone", width: 30 },
  ];
  const exportCustomers = () => {
    exportToExcel(
      fetchCustomer,
      customerColumns,
      "Customer",
      pagination.totalItems
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <CustomerFormDialog isSupplier={isSupplier} />
        <Button
          onClick={exportCustomers}
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
                  title="Address"
                  onSort={() => requestSort("name")}
                />
                <TableHeader
                  title="Contact"
                  onSort={() => requestSort("address")}
                />
                <TableHeader
                  title="Edit"
                  onSort={() => requestSort("phone")}
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
                  <TableCell>{record.address}</TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <CustomerFormDialog
                      contact={record}
                      isEdit
                      isSupplier={isSupplier}
                    />
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
