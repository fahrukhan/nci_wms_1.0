"use client";
import { TablePagination } from "@/components/TableComponent/TablePagination";

interface DefaultTablePaginationProps {
  item: number;
  length: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DefaultTablePagination: React.FC<DefaultTablePaginationProps> = ({
  item,
  length,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between mt-4 items-center">
      <div className="text-sm text-gray-500 mx-2">Total Data: {length}</div>
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(length / item)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DefaultTablePagination;

