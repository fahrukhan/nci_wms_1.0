"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportTransactionExcel } from "@/lib/utils/exportTransactionExcel";
import React from "react";

interface TagRegistrationTableHeaderProps {
  tagRegistrationData: TagRegistrationRecordDTO[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function TagRegistrationTableHeader({
  tagRegistrationData,
  searchTerm,
  setSearchTerm,
}: TagRegistrationTableHeaderProps) {
  const tagRegistrationColumns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Date Created", key: "created_at", width: 20 },
    { header: "Note", key: "note", width: 20 },
    { header: "User Name", key: "user_name", width: 30 },
  ];

  const exportTagRegistrationData = () => {
    exportTransactionExcel(
      tagRegistrationData,
      tagRegistrationColumns,
      "Tag Registration Data"
    );
  };

  return (
    <div className="table-container-border items-end justify-between">
      <div>
        <label className="mb-2 text-sm text-gray-500">Search</label>
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button
        onClick={exportTagRegistrationData}
        variant="default"
        className="bg-emerald-700 py-[10px]"
      >
        Export to Excel
      </Button>
    </div>
  );
}
