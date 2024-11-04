"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useFetchOutboundData } from "@/hooks/(transaction)/outbound/fetchOutboundData";
import { CustomSelect } from "@/components/TableComponent/CustomSelect";
import { exportTransactionExcel } from "@/lib/utils/exportTransactionExcel";
import { useAtomValue } from "jotai";
import { outboundDataAtom } from "@/lib/atom";

export default function OutboundTableHeader({
  customerOptions,
  warehouseOptions
}: {
  customerOptions: SelectBox[];
  warehouseOptions: SelectBox[];
}) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [contactId, setContactId] = useState<string>("");
  const [warehouseId, setWarehouseId] = useState<string>(
    warehouseOptions.length > 0 ? warehouseOptions[0].value : ""
  );
  const { fetchOutboundData } = useFetchOutboundData();
  const outboundData = useAtomValue(outboundDataAtom);

  const outboundColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Outbound ID", key: "outbound_id", width: 20 },
    { header: "Outbound Date", key: "outbound_date", width: 20 },
    { header: "Customer Name", key: "customer_name", width: 30 },
    { header: "Admin Name", key: "admin_name", width: 30 },
    { header: "Reference", key: "ref", width: 20 },
  ];

  useEffect(() => {
    if (startDate || endDate || contactId) {
      const filter = {
        warehouseId: warehouseId ? warehouseId : "",
        contactId: contactId ? contactId : "",
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      };
      fetchOutboundData(filter);
    }
  }, [startDate, endDate, contactId, warehouseId]);

  const handleStartDateChange = (newDate: Date | undefined) => {
    if (newDate) setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Date | undefined) => {
    if (newDate) setEndDate(newDate);
  };

  const exportOutboundData = () => {
    exportTransactionExcel(outboundData, outboundColumns, "Outbound Data");
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
          label="Customer Name"
          options={customerOptions}
          value={contactId}
          onChange={setContactId}
        />
        <CustomSelect
          label="Warehouse Name"
          options={warehouseOptions}
          value={warehouseId}
          onChange={setWarehouseId}
        />
      </div>
      <Button
        onClick={exportOutboundData}
        variant="default"
        className="bg-emerald-700 py-[10px]"
      >
        Export to Excel
      </Button>
    </div>
  );
}
