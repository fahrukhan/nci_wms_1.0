"use client";
import { Input } from "@/components/ui/input";
import React from "react";

export default function StockItemTableHeader() {
  return (
    <div className="table-container-border items-end">
      <div className="flex flex-1 items-end">
        <div>
          <label className="mb-2 text-sm text-gray-500">Search</label>
          <Input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
}
