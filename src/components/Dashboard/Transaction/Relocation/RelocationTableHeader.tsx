"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CustomSelect } from "@/components/TableComponent/CustomSelect";
import { useFetchRelocationData } from "@/hooks/(transaction)/relocation/fetchRelocationData";
import { exportTransactionExcel } from "@/lib/utils/exportTransactionExcel";
import { useAtomValue } from "jotai";
import { relocationDataAtom } from "@/lib/atom";

interface RelocationableHeaderProps {
  originOptions: SelectBox[];
  destinationOptions: SelectBox[];
  warehouseOptions: SelectBox[];
}

export const RelocationableHeader: React.FC<RelocationableHeaderProps> = ({
  originOptions,
  destinationOptions,
  warehouseOptions
}) => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [originId, setOriginId] = useState<string>("");
  const [destinationId, setDestinationId] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<string>(
    warehouseOptions.length > 0 ? warehouseOptions[0].value : ""
  );
  const { fetchRelocationData } = useFetchRelocationData();

  const relocationColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Relocation ID", key: "relocation_id", width: 20 },
    { header: "Relocation Date", key: "relocation_date", width: 20 },
    { header: "Origin Location", key: "origin_name", width: 30 },
    { header: "Destination Location", key: "destination_name", width: 30 },
    { header: "Admin Name", key: "admin_name", width: 30 },
    { header: "Reference", key: "ref", width: 20 },
  ];

  const relocationData = useAtomValue(relocationDataAtom);

  useEffect(() => {
    if (startDate || endDate || originId || destinationId) {
      const filter = {
        warehouseId: warehouseId ? warehouseId : "",
        originId: originId ? originId : "",
        destinationId: destinationId ? destinationId : "",
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      };
      fetchRelocationData(filter);
    }
  }, [startDate, endDate, originId, destinationId]);

  const handleStartDateChange = (newDate: Date | undefined) => {
    if (newDate) setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Date | undefined) => {
    if (newDate) setEndDate(newDate);
  };

  const exportRelocationData = () => {
    exportTransactionExcel(
      relocationData,
      relocationColumns,
      "Relocation Data"
    );
  };

  return (
    <div className="table-container-border flex items-end justify-between">
      <div className="flex gap-2">
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-500">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
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
                  "w-[200px] justify-start text-left font-normal",
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
          label="Origin Location"
          options={originOptions}
          value={originId}
          onChange={setOriginId}
        />
        <CustomSelect
          label="Destination Location"
          options={destinationOptions}
          value={destinationId}
          onChange={setDestinationId}
        />
        <CustomSelect
          label="Warehouse Name"
          options={warehouseOptions}
          value={warehouseId}
          onChange={setWarehouseId}
        />
      </div>
      <Button
        onClick={exportRelocationData}
        variant="default"
        className="bg-emerald-700 py-[10px]"
      >
        Export to Excel
      </Button>
    </div>
  );
};
