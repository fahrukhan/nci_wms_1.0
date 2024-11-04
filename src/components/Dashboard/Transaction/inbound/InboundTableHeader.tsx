"use client";
import React, { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { CustomSelect } from "@/components/TableComponent/TableComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchInboundData } from "@/hooks/(transaction)/inbound/fetchInboundData";
import { useAtomValue } from "jotai";
import { inboundDataAtom } from "@/lib/atom";
import { exportTransactionExcel } from "@/lib/utils/exportTransactionExcel";

export default function InboundTableHeader({
  supplierOptions,
  warehouseOptions,
}: {
  supplierOptions: SelectBox[];
  warehouseOptions: SelectBox[];
}) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [supplierId, setSupplierId] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<string>(
    warehouseOptions.length > 0 ? warehouseOptions[0].value : ""
  );
  const { fetchInboundData } = useFetchInboundData();
  const inboundData = useAtomValue(inboundDataAtom);

  useEffect(() => {
    if (startDate || endDate || supplierId) {
      const filter = {
        warehouseId: warehouseId ? warehouseId : "",
        supplierId: supplierId ? supplierId : "",
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      };
      fetchInboundData(filter);
    }
  }, [startDate, endDate, supplierId, warehouseId]);

  const handleStartDateChange = (newDate: Date | undefined) => {
    if (newDate) setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Date | undefined) => {
    if (newDate) setEndDate(newDate);
  };

  const inboundColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Inbound ID", key: "inbound_id", width: 20 },
    { header: "Inbound Date", key: "inbound_date", width: 20 },
    { header: "Supplier Name", key: "supplier_name", width: 30 },
    { header: "Admin Name", key: "admin_name", width: 30 },
    { header: "Reference", key: "ref", width: 20 },
  ];

  const exportInboundData = () => {
    exportTransactionExcel(inboundData, inboundColumns, "Inbound Data");
  };

  return (
    <div className="table-container-border flex items-end justify-between">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <CustomSelect
          label="Supplier Name"
          options={supplierOptions}
          value={supplierId}
          onChange={setSupplierId}
        />
        <CustomSelect
          label="Warehouse Name"
          options={warehouseOptions}
          value={warehouseId}
          onChange={setWarehouseId}
        />
      </div>
      <Button
        onClick={exportInboundData}
        variant="default"
        className="bg-emerald-700 py-[10px]"
      >
        Export to Excel
      </Button>
    </div>
  );
}
