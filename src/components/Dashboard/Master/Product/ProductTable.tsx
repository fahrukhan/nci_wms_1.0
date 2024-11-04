"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  useSortableData,
  TableHeader,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/app/actions/productActions";
import { ProductFormButton } from "./ProductFormButton";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/utils/exportExcel";
import Image from "next/image";

export const ProductTable = ({
  initialData,
  initialPagination,
}: {
  initialData: ProductDTO[];
  initialPagination: {
    currentPage: number;
    totalItems: number;
    perPage: number;
    totalPages: number;
  };
}) => {
  const [products, setProducts] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { sortedData, requestSort } = useSortableData<ProductDTO>(products);

  const fetchData = useCallback(
    async (page: number, search: string) => {
      try {
        const { data, pagination } = await fetchProducts(
          page,
          initialPagination.perPage,
          search
        );
        setProducts(data);
        setPagination(pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
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

  const productColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Product Code", key: "product_code", width: 10 },
    { header: "Product Name", key: "name", width: 30 },
    { header: "Image", key: "image", width: 30 },
    { header: "Category", key: "category.name", width: 20 },
    { header: "Attribute 1", key: "attribute1.name", width: 30 },
    { header: "Attribute 2", key: "attribute2.name", width: 30 },
    { header: "Attribute 3", key: "attribute3.name", width: 30 },
    { header: "Qty Min", key: "qty_min", width: 10 },
    { header: "Qty Max", key: "qty_max", width: 10 },
    { header: "Unit Base", key: "unit_base.name", width: 10 },
    { header: "Unit Sub", key: "unit_sub.name", width: 10 },
    { header: "Conversion Factor", key: "convertion_factor", width: 15 },
  ];

  const exportProducts = () => {
    exportToExcel(
      fetchProducts,
      productColumns,
      "Product",
      pagination.totalItems
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <ProductFormButton />
        <Button
          onClick={exportProducts}
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
                <TableHeader
                  title="Product Image"
                  sortable={false}
                  style={{ width: "200px" }}
                />
                <TableHeader
                  title="Product Code"
                  onSort={() => requestSort("product_code")}
                  style={{ width: "150px" }}
                />
                <TableHeader
                  title="Product Name"
                  onSort={() => requestSort("name")}
                  style={{ width: "200px" }}
                />
                <TableHeader
                  title="Category"
                  onSort={() => requestSort("category.name")}
                />
                <TableHeader
                  title="Attribute 1"
                  onSort={() => requestSort("attribute1.name")}
                  style={{ width: "90px" }}
                />
                <TableHeader
                  title="Attribute 2"
                  onSort={() => requestSort("attribute2.name")}
                  style={{ width: "90px" }}
                />
                <TableHeader
                  title="Attribute 3"
                  onSort={() => requestSort("attribute3.name")}
                  style={{ width: "90px" }}
                />
                <TableHeader
                  title="Qty Min"
                  onSort={() => requestSort("qty_min")}
                />
                <TableHeader
                  title="Qty Max"
                  onSort={() => requestSort("qty_max")}
                />
                <TableHeader
                  title="Unit Base"
                  onSort={() => requestSort("unit_base.name")}
                />
                <TableHeader
                  title="Unit Sub"
                  onSort={() => requestSort("unit_sub.name")}
                />
                <TableHeader
                  title="Conversion Factor"
                  onSort={() => requestSort("convertion_factor")}
                />
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
                  <TableCell
                    style={{
                      width: "100px",
                      height: "70px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={process.env.NEXT_PUBLIC_IMG_URL + record.image}
                      alt="Product image"
                      width={100}
                      height={70}
                    />
                  </TableCell>
                  <TableCell style={{ width: "100px" }}>
                    {record.product_code}
                  </TableCell>
                  <TableCell style={{ width: "200px" }}>
                    {record.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.category.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.attribute1?.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.attribute2?.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.attribute3?.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.qty_min}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.qty_max}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.unit_base.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.unit_sub.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    {record.convertion_factor}
                  </TableCell>
                  <TableCell padding="px-4" style={{ width: "30px" }}>
                    <ProductFormButton isEdit />
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
