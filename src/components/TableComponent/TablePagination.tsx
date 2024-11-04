import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPaginationItems = () => {
    const pagesToShow = 3;
    const items = [];

    // Previous button
    items.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          href="#"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages > 1) {
      let startPage = Math.max(2, currentPage - Math.floor(pagesToShow / 2));
      let endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);

      if (endPage - startPage < pagesToShow - 1) {
        startPage = Math.max(2, endPage - pagesToShow + 1);
      }

      if (startPage > 2) {
        items.push(
          <PaginationItem key="startEllipsis">
            <PaginationLink href="#">...</PaginationLink>
          </PaginationItem>
        );
      }

      for (let page = startPage; page <= endPage; page++) {
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="endEllipsis">
            <PaginationLink href="#">...</PaginationLink>
          </PaginationItem>
        );
      }
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>{renderPaginationItems()}</PaginationContent>
      </Pagination>
    </div>
  );
};
