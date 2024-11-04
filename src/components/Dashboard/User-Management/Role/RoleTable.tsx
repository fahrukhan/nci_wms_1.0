"use client";
import React, { useState } from "react";
import { RoleFormDialog } from "./RoleFormDialog";
import {
  MenuDTO,
  RoleDTO,
} from "@/types/Dashboard/User-Management/userManagement";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TableHeader } from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";

interface RolesTableProps {
  rolesData: RoleDTO[];
  allMenus: MenuDTO[];
}

export const RolesTable: React.FC<RolesTableProps> = ({
  rolesData,
  allMenus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = rolesData.filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <RoleFormDialog allMenus={allMenus} />
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
                <TableHeader title="Role Name" />
                <TableHeader title="Menus" sortable={false} />
                <TableHeader title="Edit" sortable={false} />
              </tr>
            </thead>
            <tbody>
              {currentData.map((role, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <TableCell style={{ width: "15px" }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell style={{ width: "300px" }}>
                    {role.role_name}
                  </TableCell>
                  <TableCell>{role.menus}</TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <RoleFormDialog role={role} isEdit allMenus={allMenus} />
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DefaultTablePagination
        item={itemsPerPage}
        length={rolesData.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
