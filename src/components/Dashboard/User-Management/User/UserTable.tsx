"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  useSortableData,
  TableHeader,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import { Input } from "@/components/ui/input";
import { UserFormDialog } from "./UserFormDialog";
import { User } from "@/drizzle/schema/UserManagement/users.schema";
import { RoleDTO } from "@/types/Dashboard/User-Management/userManagement";

interface UserTableProps {
  usersData: User[];
  rolesData: RoleDTO[];
}

export const UsersTable = ({ usersData, rolesData }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { sortedData, requestSort } = useSortableData<User>(usersData);

  const filteredData = sortedData.filter(
    (usersData) =>
      usersData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usersData.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <UserFormDialog roleData={rolesData} />
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
                <TableHeader
                  title="Name"
                  onSort={() => requestSort("username")}
                />
                <TableHeader
                  title="Email"
                  onSort={() => requestSort("email")}
                />
                <TableHeader
                  title="Phone"
                  onSort={() => requestSort("phone")}
                />
                <TableHeader
                  title="Role"
                  onSort={() => requestSort("role_id")}
                />
                <TableHeader title="Edit" sortable={false} />
              </tr>
            </thead>
            <tbody>
              {currentData.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCell style={{ width: "15px" }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{record.username}</TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell style={{ width: "80px", textAlign: "right" }}>
                    {record.role_id}
                  </TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <UserFormDialog user={record} isEdit roleData={rolesData} />
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DefaultTablePagination
        item={itemsPerPage}
        length={sortedData.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
