"use client";
import React, { useState } from "react";
import {
  TableHeader,
  useSortableData,
} from "@/components/TableComponent/TableComponent";
import TableCell from "@/components/TableComponent/TableCell";
import { format } from "date-fns";
import DefaultTablePagination from "@/components/TableComponent/DefaultTablePagination";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TrackingTableProps {
  initialTrackingData?: TrackingDataRecordDTO[];
}

export const TrackingTable: React.FC<TrackingTableProps> = ({
  initialTrackingData = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [epc, setEpc] = useState("");
  const [data, setData] = useState<TrackingDataRecordDTO[]>(initialTrackingData);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const allHistoryData = data.flatMap(record => record.history);
  const { sortedData, requestSort } = useSortableData<HistoryData>(allHistoryData);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const fetchedData = await fetchTrackingData(epc);
      setData(fetchedData.data); // Adjust based on actual response structure
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  const fetchTrackingData = async (epc: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tracking?type=rfid&id=${epc}`, {
      headers: await getHeaders(),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(
        errorResponse.status_message ||
        "An error occurred while fetching tag registration data"
      );
    }

    return res.json();
  };

  return (
    <div>
      <div className="flex justify-end gap-4 mb-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            value={epc}
            onChange={(e) => setEpc(e.target.value)}
            placeholder="Enter EPC"
            className="p-2 border border-gray-300 rounded"
            style={{ width: '250px' }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
      {error && <div>Error: {error}</div>}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="table-head">
            <tr>
              <TableHeader title="No." sortable={false} />
              <TableHeader title="Date Created" onSort={() => requestSort("created_at")} />
              <TableHeader title="Activity" onSort={() => requestSort("activity")} />
              <TableHeader title="Note" onSort={() => requestSort("note")} />
              <TableHeader title="Reference" onSort={() => requestSort("ref")} />
              <TableHeader title="User Name" onSort={() => requestSort("user_name")} />
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                <TableCell>{record.activity}</TableCell>
                <TableCell>{record.note}</TableCell>
                <TableCell>{record.ref}</TableCell>
                <TableCell>{record.user_name}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DefaultTablePagination item={itemsPerPage} length={sortedData.length} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};
