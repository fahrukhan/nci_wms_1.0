"use client";
import React, { useEffect, useState } from "react";
import { CustomSelect } from "@/components/TableComponent/TableComponent";
import { useFetchStockOpnameData } from "@/hooks/(transaction)/stockOpname/fetchStockOpnameData";
import { useFetchSOProfileDetail } from "@/hooks/(transaction)/stockOpname/fetchSOProfileDetail";
import { Button } from "@/components/ui/button";
import { exportTransactionExcel } from "@/lib/utils/exportTransactionExcel";
import { useAtomValue } from "jotai";
import { stockOpnameProfileDetailAtom } from "@/lib/atom";

export default function SOProfileDetailHeader({
  warehouseOptions,
  soProfileId,
}: {
  warehouseOptions: SelectBox[];
  soProfileId: string;
}) {
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const { fetchSOProfileDetail } = useFetchSOProfileDetail(soProfileId);
  const SOProfileDetailData = useAtomValue(stockOpnameProfileDetailAtom);

  useEffect(() => {
    const filter = {
      warehouseId: warehouseId ?? "",
    };
    fetchSOProfileDetail(filter);
  }, [warehouseId]);

  const SOProfileDetailColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Stock Opname ID", key: "stock_opname_id", width: 20 },
    { header: "Stock Opname Date", key: "stock_opname_date", width: 20 },
    { header: "Location Name", key: "location_name", width: 30 },
    { header: "Location Path Name", key: "location_path_name", width: 30 },
    { header: "Scan Type", key: "scan_type", width: 20 },
    { header: "User Name", key: "user_name", width: 30 },
    { header: "Quantity", key: "quantity", width: 20 },
    { header: "Created At", key: "created_at", width: 20 },
  ];

  const exportSOProfileDetail = () => {
    exportTransactionExcel(
      SOProfileDetailData,
      SOProfileDetailColumns,
      "SO Profile Detail"
    );
  };

  return (
    <div className="table-container-border flex items-end justify-between">
      <CustomSelect
        label="Warehouse Name"
        options={warehouseOptions}
        value={warehouseId ?? ""}
        onChange={(value) => setWarehouseId(value === "" ? null : value)}
      />
      <Button
        onClick={exportSOProfileDetail}
        variant="default"
        className="bg-emerald-700 py-[10px]"
      >
        Export to Excel
      </Button>
    </div>
  );
}
