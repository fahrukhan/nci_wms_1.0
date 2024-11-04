"use client";
import React, { useState, useMemo } from "react";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import { format } from "date-fns";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import TagRegistrationTableHeader from "./TagRegistrationTableHeader";

interface TagRegistrationTableProps {
  tagRegistrationData: TagRegistrationRecordDTO[];
}

export const TagRegistrationTable: React.FC<TagRegistrationTableProps> = ({
  tagRegistrationData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return tagRegistrationData.filter((record) =>
      Object.values(record).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [tagRegistrationData, searchTerm]);

  const { sortedData, requestSort } =
    useSortableData<TagRegistrationRecordDTO>(filteredData);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <TagRegistrationTableHeader
        tagRegistrationData={filteredData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader
                title="No."
                sortable={false}
                style={{ width: "15px" }}
              />
              <TableHeader
                title="Date Created"
                onSort={() => requestSort("created_at")}
              />
              <TableHeader title="Note" onSort={() => requestSort("note")} />
              <TableHeader
                title="User Name"
                onSort={() => requestSort("user_name")}
              />
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
                <TableCell>
                  {format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{record.note}</TableCell>
                <TableCell>{record.user_name}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
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
