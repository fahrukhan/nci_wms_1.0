// "use client";

// import {
//   Column,
//   TableInstance,
//   TableState,
//   useFilters,
//   usePagination,
//   useSortBy,
//   useTable,
// } from "react-table";
// import {
//   FaChevronDown,
//   FaChevronUp,
//   FaInfoCircle,
//   FaPen,
//   FaPlus,
//   FaSpinner,
//   FaTrash,
// } from "react-icons/fa";
// import React, { useMemo, useState } from "react";

// interface Unit {
//   unit_id: number;
//   name: string;
//   symbol: string;
//   created_at: string;
// }
// type OriginalType = {
//   [key: string]: any;
// };
// interface UnitConversion {
//   unit_convert_id: number;
//   unit_base_id: number;
//   unit_sub_id: number;
//   conversion_factor: number;
//   created_at: string;
//   updated_at: string;
// }

// interface TableProps<T extends object> {
//   crud?: boolean;
//   onAdd?: (item: T) => void;
//   title?: string;
//   onEdit?: (item: T) => void;
//   Form?: React.FC<{
//     item: T;
//     afterSave: () => void;
//     supportFn?: { toggle: () => void };
//     supportData?: any;
//     onAdd?: (item: T) => void;
//     onEdit?: (item: T) => void;
//     mode: "add" | "edit";
//   }>;
//   columns: Column<T>[];
//   onDelete?: (item: T) => void;
//   loading?: boolean;
//   detailPath?: string;
//   data?: T[];
//   detailRefId?: string;
//   supportFn?: { toggle: () => void };
//   supportData?: any;
//   formSize?: "sm" | "md" | "lg" | "xl";
//   history?: { push: (path: string) => void };
//   infoLabel?: string;
//   disabledAdd?: boolean;
//   alertMessage?: string;
//   alertColor?: string;
//   hideAddButton?: boolean;
//   hideDeleteButton?: boolean;
//   hideEditButton?: boolean;
//   showSearch?: boolean;
// }

// export const TableExpand = <T extends object>({
//   crud,
//   onAdd,
//   title,
//   onEdit,
//   Form,
//   columns,
//   onDelete,
//   loading = false,
//   detailPath = "",
//   data = [],
//   detailRefId = "id",
//   supportFn = { toggle: () => {} },
//   supportData = {},
//   formSize = "xl",
//   history,
//   infoLabel = "",
//   disabledAdd = false,
//   alertMessage = "",
//   alertColor = "info",
//   hideAddButton = false,
//   hideDeleteButton = false,
//   hideEditButton = false,
//   showSearch = false,
// }: TableProps<T>) => {
//   const [selectedItems, setSelectedItems] = useState<T[]>([]);
//   const [isShowForm, setIsShowForm] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<T | null>(null);
//   const [mode, setMode] = useState<"add" | "edit">("add");
//   const [isShowAlert, setIsShowAlert] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(e.target.value);
//   };

//   const toggleExpandRow = (index: number) => {
//     const newExpandedRows = new Set(expandedRows);
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);
//     }
//     setExpandedRows(newExpandedRows);
//   };

//   const getUnitConversions = (unitId: number): UnitConversion[] => {
//     return supportData.filter(
//       (uc: UnitConversion) => uc.unit_base_id === unitId
//     );
//   };

//   const filteredData = useMemo(() => {
//     if (!searchInput) return data;

//     return data.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(searchInput.toLowerCase())
//       )
//     );
//   }, [data, searchInput]);
//   const tableData = useMemo(() => filteredData, [filteredData]);

//   const tableColumns = useMemo(() => columns, [columns]);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns: tableColumns,
//       data: tableData,
//       initialState: { pageIndex: 0 } as Partial<TableState<T>>,
//     },
//     useFilters,
//     useSortBy,
//     usePagination
//   ) as TableInstance<T> & {
//     page: any[];
//     canPreviousPage: boolean;
//     canNextPage: boolean;
//     pageOptions: number[];
//     gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
//     nextPage: () => void;
//     previousPage: () => void;
//     setPageSize: (pageSize: number) => void;
//     state: TableState<T> & { pageIndex: number; pageSize: number };
//   };

//   const handleCheckboxChange = (item: T) => {
//     const index = selectedItems.indexOf(item);
//     if (index === -1) {
//       setSelectedItems([...selectedItems, item]);
//     } else {
//       setSelectedItems(selectedItems.filter((i) => i !== item));
//     }
//   };

//   const clickAdd = () => {
//     setMode("add");
//     setSelectedItem(null);
//     setIsShowForm(true);
//   };

//   const clickEdit = (item: T) => {
//     setMode("edit");
//     setSelectedItem(item);
//     setIsShowForm(true);
//   };

//   const clickDelete = (item: T) => {
//     setSelectedItem(item);
//     setIsShowAlert(true);
//   };

//   const confirmDelete = () => {
//     setIsShowAlert(false);
//     onDelete?.(selectedItem!);
//   };

//   const cancelDelete = () => {
//     setIsShowAlert(false);
//   };
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className="rounded mt-5 bg-white shadow-sm p-6">
//       <div className="flex flex-col gap-3">
//         {title && <div className="text-left text-2xl font-bold">{title}</div>}
//         <div className="flex justify-between gap-3">
//           {showSearch && (
//             <div
//               className={`relative mb-4 transition-all duration-300 ${
//                 isFocused ? "w-3/6" : "w-1/4"
//               }`}
//             >
//               <label htmlFor="Search" className="sr-only">
//                 Search
//               </label>
//               <div className="flex items-center">
//                 <span className="absolute inset-y-0 left-0 ml-4 flex items-center pl-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     className="text-gray-600 h-5 w-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//                     />
//                   </svg>
//                 </span>
//                 <input
//                   type="text"
//                   id="Search"
//                   value={searchInput}
//                   onChange={handleSearchChange}
//                   placeholder="Try searching "
//                   className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-full border py-2.5 pl-12 pr-4 text-sm"
//                   onFocus={() => setIsFocused(true)}
//                   onBlur={() => setIsFocused(false)}
//                   spellCheck={false}
//                   data-ms-editor="false"
//                 />
//               </div>
//             </div>
//           )}
//           {crud && !hideAddButton && (
//             <button
//               className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//               disabled={disabledAdd}
//               onClick={clickAdd}
//             >
//               <FaPlus className="mr-2 inline-block" /> Tambah
//             </button>
//           )}
//         </div>
//       </div>

//       {alertMessage && (
//         <div
//           className={`mb-4 rounded-md bg-${alertColor}-100 p-4 text-${alertColor}-700`}
//         >
//           <FaInfoCircle className="mr-2 inline-block" /> {alertMessage}
//         </div>
//       )}
//       <div className="mt-4 overflow-x-auto">
//         {infoLabel && (
//           <div
//             className="mb-4 rounded-md bg-blue-100 p-4 text-sm text-blue-700"
//             role="alert"
//           >
//             {infoLabel}
//           </div>
//         )}
//         <table
//           {...getTableProps()}
//           className="min-w-full divide-y divide-gray-200 border"
//         >
//           <thead className="bg-[#EAF2FC] rounded">
//             {headerGroups.map((headerGroup) => {
//               const { key: headerGroupKey, ...headerGroupProps } =
//                 headerGroup.getHeaderGroupProps();
//               return (
//                 <tr key={headerGroupKey} {...headerGroupProps}>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//                       checked={selectedItems.length === data.length}
//                       onChange={() =>
//                         selectedItems.length === data.length
//                           ? setSelectedItems([])
//                           : setSelectedItems([...data])
//                       }
//                     />
//                   </th>
//                   {headerGroup.headers.map((column) => {
//                     // Use optional chaining and provide a fallback for getSortByToggleProps
//                     const sortByToggleProps =
//                       (column as any).getSortByToggleProps?.() || {};
//                     const { key: columnKey, ...columnProps } =
//                       column.getHeaderProps(sortByToggleProps);

//                     const getSortIndicator = (column: any) => {
//                       if (!column.isSorted) {
//                         return "";
//                       }
//                       return column.isSortedDesc ? " 🔽" : " 🔼";
//                     };

//                     return (
//                       <th
//                         key={columnKey}
//                         {...columnProps}
//                         className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//                       >
//                         {column.render("Header")}
//                         <span>{getSortIndicator(column)}</span>
//                       </th>
//                     );
//                   })}

//                   {(crud || detailPath) && (
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                       Aksi
//                     </th>
//                   )}
//                 </tr>
//               );
//             })}
//           </thead>
//           <tbody
//             {...getTableBodyProps()}
//             className="divide-y divide-gray-200 bg-white"
//           >
//             {loading && (
//               <tr>
//                 <td
//                   colSpan={columns.length + 2}
//                   className="px-6 py-4 text-center"
//                 >
//                   <FaSpinner className="animate-spin inline-block" />
//                 </td>
//               </tr>
//             )}
//             {page.map((row) => {
//               prepareRow(row);
//               const { key: rowKey, ...rowProps } = row.getRowProps(); // Extract the key separately

//               const conversions = getUnitConversions(row.original.unit_id);
//               const isExpanded = expandedRows.has(row.id);
//               return (
//                 <React.Fragment key={`row-${row.original.unit_id}`}>
//                   <tr {...rowProps} className="transition hover:bg-gray-100">
//                     <td className="w-4 px-6 py-4">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
//                         checked={selectedItems.indexOf(row.original) !== -1}
//                         onChange={() => handleCheckboxChange(row.original)}
//                       />
//                     </td>
//                     {row.cells.map((cell: any) => {
//                       const { key: cellKey, ...cellProps } =
//                         cell.getCellProps(); // Extract the key separately from cell props
//                       return (
//                         <td
//                           key={`cell-${row.original.unit_id}-${cell.column.id}`} // Ensure each cell has a unique key
//                           {...cellProps}
//                           className="whitespace-no-wrap px-6 py-4 text-sm font-medium text-gray-900"
//                         >
//                           {cell.render("Cell")}
//                         </td>
//                       );
//                     })}
//                     <td className="whitespace-no-wrap space-y-3 px-6 py-4 text-sm font-medium text-gray-900">
//                       {conversions.length > 0 && (
//                         <button
//                           className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                           onClick={() => toggleExpandRow(row.id)}
//                         >
//                           {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//                         </button>
//                       )}
//                       {crud && !hideEditButton && (
//                         <button
//                           className="mr-2 rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
//                           onClick={() => clickEdit(row.original)}
//                         >
//                           <FaPen />
//                         </button>
//                       )}
//                       {crud && !hideDeleteButton && (
//                         <button
//                           className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
//                           onClick={() => clickDelete(row.original)}
//                         >
//                           <FaTrash />
//                         </button>
//                       )}
//                       {detailPath && history && (
//                         <button
//                           className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                           onClick={() =>
//                             history.push(
//                               `${detailPath}${row.original[detailRefId]}`
//                             )
//                           }
//                         >
//                           <FaPen />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                   {isExpanded && (
//                     <tr key={`expanded-${row.id}`}>
//                       <td colSpan={columns.length + 1} className="px-6">
//                         <table className="min-w-full bg-gray-100 rounded">
//                           <thead>
//                             <tr>
//                               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                                 Unit Name
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                                 Unit Symbol
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                                 Conversion Factor
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {getUnitConversions(row.original.unit_id).map(
//                               (conversion: any) => {
//                                 const unit = data.find(
//                                   (unit: any) =>
//                                     unit.unit_id === conversion.unit_sub_id
//                                 );
//                                 return (
//                                   <tr
//                                     key={`conversion-${conversion.unit_convert_id}`}
//                                   >
//                                     <td
//                                       key={`name-${conversion.unit_convert_id}`}
//                                       className="px-6 text-sm font-medium text-gray-900"
//                                     >
//                                       {unit?.name || "N/A"}
//                                     </td>
//                                     <td
//                                       key={`symbol-${conversion.unit_convert_id}`}
//                                       className="px-6 py-4 text-sm font-medium text-gray-900"
//                                     >
//                                       {unit?.symbol}
//                                     </td>
//                                     <td
//                                       key={`factor-${conversion.unit_convert_id}`}
//                                       className="px-6 py-4 text-sm font-medium text-gray-900"
//                                     >
//                                       {conversion.conversion_factor}
//                                     </td>
//                                   </tr>
//                                 );
//                               }
//                             )}
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}

//             {!loading && page.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={columns.length + 2}
//                   className="whitespace-no-wrap px-6 py-4 text-center text-sm font-medium text-gray-900"
//                 >
//                   Data tidak tersedia!
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex items-center justify-between py-3">
//         <div className="flex items-center">
//           <button
//             className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//             onClick={() => previousPage()}
//             disabled={!canPreviousPage}
//           >
//             {"<"}
//           </button>
//           {pageOptions.map((pageOption) => (
//             <button
//               key={pageOption}
//               className={`mr-2 rounded-md px-4 py-2 ${
//                 pageIndex === pageOption
//                   ? "bg-blue-500 text-white"
//                   : "bg-white text-blue-500"
//               } hover:bg-blue-600 hover:text-white`}
//               onClick={() => gotoPage(pageOption)}
//             >
//               {pageOption + 1}
//             </button>
//           ))}
//           <button
//             className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//             onClick={() => nextPage()}
//             disabled={!canNextPage}
//           >
//             {">"}
//           </button>
//         </div>
//         <div className="flex items-center">
//           <span className="mr-2">
//             Page{" "}
//             <strong>
//               {pageIndex + 1} of {pageOptions.length}
//             </strong>{" "}
//           </span>
//           <select
//             className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//             value={pageSize}
//             onChange={(e) => setPageSize(Number(e.target.value))}
//           >
//             {[5, 10, 25, 50].map((size) => (
//               <option key={size} value={size}>
//                 Show {size}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       {isShowForm && Form && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div
//             className={`w-full max-w-${formSize} rounded-lg bg-white p-6 border-b-1 border-t-0 border-r-0 border-l-0 border-[#2240B0] border-[5px]`}
//           >
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-2xl font-bold">{title} - Form</h2>
//               <button
//                 className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
//                 onClick={() => {
//                   setIsShowForm(false);
//                   supportFn?.toggle?.();
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//             <Form
//               item={selectedItem!}
//               afterSave={() => setIsShowForm(false)}
//               supportFn={supportFn}
//               supportData={supportData}
//               onAdd={onAdd}
//               onEdit={onEdit}
//               mode={mode}
//             />
//           </div>
//         </div>
//       )}
//       {isShowAlert && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//             <h2 className="mb-4 text-2xl font-bold">Apa anda yakin?</h2>
//             <p className="mb-4">
//               Data yang sudah dihapus tidak dapat dikembalikan.
//             </p>
//             <div className="flex justify-end">
//               <button
//                 className="mr-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
//                 onClick={cancelDelete}
//               >
//                 Batal
//               </button>
//               <button
//                 className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
//                 onClick={confirmDelete}
//               >
//                 Ya, hapus data ini!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TableExpand;
