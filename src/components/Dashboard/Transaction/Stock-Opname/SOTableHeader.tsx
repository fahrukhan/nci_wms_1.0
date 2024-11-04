"use client";
import React, { useEffect, useState } from "react";
import { CustomSelect } from "@/components/TableComponent/TableComponent";
import { useFetchStockOpnameData } from "@/hooks/(transaction)/stockOpname/fetchStockOpnameData";

export default function StockOpnameTableHeader({
  warehouseOptions,
}: {
  warehouseOptions: SelectBox[];
}) {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const { fetchStockOpnameData } = useFetchStockOpnameData();

  useEffect(() => {
    const filter = {
      warehouseId: warehouseId ?? "",
    };
    fetchStockOpnameData(filter);
  }, [warehouseId]);

  return (
    <div className="table-container-border">
      <CustomSelect
        label="Warehouse Name"
        options={warehouseOptions}
        value={warehouseId ?? ""}
        onChange={(value) => setWarehouseId(value === "" ? null : value)}
      />
    </div>
  );
}
