import {
  Column,
  TableInstance,
  TableState,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  FaInfoCircle,
  FaPen,
  FaPlus,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import React, { useMemo, useState } from "react";

/**
 * @typedef {Object} TableProps
 * @description Properti untuk komponen TableCrud.
 * @property {boolean} [crud] - Mengaktifkan operasi CRUD (Create, Read, Update, Delete).
 * @property {Function} [onAdd] - Fungsi untuk menambah item.
 * @property {string} [title] - Judul tabel.
 * @property {Function} [onEdit] - Fungsi untuk mengedit item.
 * @property {React.FC} [Form] - Komponen form untuk menambah dan mengedit item.
 * @property {Column[]} columns - Array kolom untuk tabel.
 * @property {Function} [onDelete] - Fungsi untuk menghapus item.
 * @property {boolean} [loading] - Status loading untuk tabel.
 * @property {string} [detailPath] - Path URL untuk tampilan detail item.
 * @property {Object[]} [data] - Data untuk ditampilkan dalam tabel.
 * @property {string} [detailRefId] - Kunci unik untuk URL tampilan detail.
 * @property {Object} [supportFn] - Fungsi tambahan untuk form.
 * @property {Object} [supportData] - Data tambahan untuk form.
 * @property {"sm"|"md"|"lg"|"xl"} [formSize] - Ukuran modal form.
 * @property {Object} [history] - Objek untuk navigasi.
 * @property {string} [infoLabel] - Label informasi tambahan di atas tabel.
 * @property {boolean} [disabledAdd] - Menonaktifkan tombol tambah.
 * @property {string} [alertMessage] - Pesan notifikasi.
 * @property {string} [alertColor] - Warna notifikasi.
 * @property {boolean} [hideAddButton] - Menyembunyikan tombol tambah.
 * @property {boolean} [hideDeleteButton] - Menyembunyikan tombol hapus.
 * @property {boolean} [hideEditButton] - Menyembunyikan tombol edit.
 * @property {boolean} [showSearch] - Menampilkan input pencarian.
 */

/**
 * @module TableCrud
 * @description Komponen tabel CRUD dengan fitur sorting, filtering, pagination, dan form untuk menambah serta mengedit data. Komponen ini menggunakan `react-table` untuk manajemen tabel dan `react-icons` untuk ikon.
 * @param {TableProps} props - Properti yang diterima oleh komponen.
 * @returns {JSX.Element} Komponen tabel CRUD.
 */
interface TableProps<T extends object> {
  crud?: boolean;
  onAdd?: (item: T) => void;
  title?: string;
  onEdit?: (item: T) => void;
  Form?: React.FC<{
    item: T;
    afterSave: () => void;
    supportFn?: { toggle: () => void };
    supportData?: any;
    onAdd?: (item: T) => void;
    onEdit?: (item: T) => void;
    mode: "add" | "edit";
  }>;
  columns: Column<T>[];
  onDelete?: (item: T) => void;
  loading?: boolean;
  detailPath?: string;
  data?: T[];
  detailRefId?: string;
  supportFn?: { toggle: () => void };
  supportData?: any;
  formSize?: "sm" | "md" | "lg" | "xl";
  history?: { push: (path: string) => void };
  infoLabel?: string;
  disabledAdd?: boolean;
  alertMessage?: string;
  alertColor?: string;
  hideAddButton?: boolean;
  hideDeleteButton?: boolean;
  hideEditButton?: boolean;
  showSearch?: boolean;
}
type OriginalType = {
  [key: string]: any;
};
const TableCrud = <T extends object>({
  crud,
  onAdd,
  title,
  onEdit,
  Form,
  columns,
  onDelete,
  loading = false,
  detailPath = "",
  data = [],
  detailRefId = "id",
  supportFn = { toggle: () => {} },
  supportData = {},
  formSize = "xl",
  history,
  infoLabel = "",
  disabledAdd = false,
  alertMessage = "",
  alertColor = "info",
  hideAddButton = false,
  hideDeleteButton = false,
  hideEditButton = false,
  showSearch = false,
}: TableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchInput) return data;

    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [data, searchInput]);

  const tableData = useMemo(() => filteredData, [filteredData]);

  const tableColumns = useMemo(() => columns, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: { pageIndex: 0 } as Partial<TableState<T>>,
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: any[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageOptions: number[];
    gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (pageSize: number) => void;
    state: TableState<T> & { pageIndex: number; pageSize: number };
  };

  const clickAdd = () => {
    setMode("add");
    setSelectedItem({} as T);
    setIsShowForm(true);
  };

  const clickEdit = (item: T) => {
    setMode("edit");
    setSelectedItem(item);
    setIsShowForm(true);
  };

  const clickDelete = (item: T) => {
    setSelectedItem(item);
    setIsShowAlert(true);
  };

  const confirmDelete = () => {
    setIsShowAlert(false);
    onDelete?.(selectedItem!);
  };

  const cancelDelete = () => {
    setIsShowAlert(false);
  };

  return (
    <div className="rounded bg-white shadow-sm px-4">
      <div className="justify-between gap-3 flex">
        {title && (
          <div className="mb-4 text-left text-2xl font-bold">{title}</div>
        )}
        {crud && !hideAddButton && (
          <button
            className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={disabledAdd}
            onClick={clickAdd}
          >
            <FaPlus className="mr-2 inline-block" /> Tambah
          </button>
        )}
      </div>
      {showSearch && (
        <div className="relative w-full mb-4">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <div className="flex items-center">
            <span className="absolute inset-y-0 left-0 ml-4 flex items-center pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="text-gray-600 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              id="Search"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search"
              className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-full border py-2.5 pl-12 pr-4 text-sm"
            />
          </div>
        </div>
      )}
      {alertMessage && (
        <div
          className={`mb-4 rounded-md bg-${alertColor}-100 p-4 text-${alertColor}-700`}
        >
          <FaInfoCircle className="mr-2 inline-block" /> {alertMessage}
        </div>
      )}
      <div className="mt-4 overflow-x-auto">
        {infoLabel && (
          <div
            className="mb-4 rounded-md bg-blue-100 p-4 text-sm text-blue-700"
            role="alert"
          >
            {infoLabel}
          </div>
        )}
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200 border"
        >
          <thead className="bg-[#EAF2FC] rounded">
            {headerGroups.map((headerGroup) => {
              const { key: headerGroupKey, ...headerGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <tr key={headerGroupKey} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    // Use optional chaining and provide a fallback for getSortByToggleProps
                    const sortByToggleProps =
                      (column as any).getSortByToggleProps?.() || {};
                    const { key: columnKey, ...columnProps } =
                      column.getHeaderProps(sortByToggleProps);

                    const getSortIndicator = (column: any) => {
                      if (!column.isSorted) {
                        return "";
                      }
                      return column.isSortedDesc ? " 🔽" : " 🔼";
                    };

                    return (
                      <th
                        key={columnKey}
                        {...columnProps}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {column.render("Header")}
                        <span>{getSortIndicator(column)}</span>
                      </th>
                    );
                  })}

                  {(crud || detailPath) && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Aksi
                    </th>
                  )}
                </tr>
              );
            })}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="divide-y divide-gray-200 bg-white"
          >
            {loading && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-6 py-4 text-center"
                >
                  <FaSpinner className="animate-spin inline-block" />
                </td>
              </tr>
            )}
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <tr
                  key={rowKey}
                  {...rowProps}
                  className="transition hover:bg-gray-100"
                >
                  {row.cells.map((cell: any) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td
                        key={cellKey}
                        {...cellProps}
                        className="whitespace-no-wrap px-6 py-4 text-sm font-medium text-gray-900"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  {(crud || detailPath) && (
                    <td className="whitespace-no-wrap space-y-3 px-6 py-4 text-sm font-medium text-gray-900">
                      {crud && !(row.original as OriginalType).hide_action && (
                        <>
                          {!hideEditButton && (
                            <button
                              className="mr-2 rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                              onClick={() => clickEdit(row.original)}
                            >
                              <FaPen />
                            </button>
                          )}
                          {!hideDeleteButton && (
                            <button
                              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                              onClick={() => clickDelete(row.original)}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </>
                      )}
                      {detailPath && history && (
                        <button
                          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          onClick={() =>
                            history.push(
                              `${detailPath}${
                                (row.original as OriginalType)[detailRefId]
                              }`
                            )
                          }
                        >
                          <FaPen />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {!loading && page.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="whitespace-no-wrap px-6 py-4 text-center text-sm font-medium text-gray-900"
                >
                  Data tidak tersedia!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
          <button
            className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          {pageOptions.map((pageOption) => (
            <button
              key={pageOption}
              className={`mr-2 rounded-md px-4 py-2 ${
                pageIndex === pageOption
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              } hover:bg-blue-600 hover:text-white`}
              onClick={() => gotoPage(pageOption)}
            >
              {pageOption + 1}
            </button>
          ))}
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isShowForm && Form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={` max-w-${formSize} rounded-lg bg-white p-6 border-b-1 border-t-0 border-r-0 border-l-0 border-[#2240B0] border-[5px]`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{title} - Form</h2>
              <button
                className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
                onClick={() => {
                  setIsShowForm(false);
                  supportFn?.toggle?.();
                }}
              >
                Close
              </button>
            </div>
            <Form
              item={selectedItem!}
              afterSave={() => setIsShowForm(false)}
              supportFn={supportFn}
              supportData={supportData}
              onAdd={onAdd}
              onEdit={onEdit}
              mode={mode}
            />
          </div>
        </div>
      )}
      {isShowAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold">Apa anda yakin?</h2>
            <p className="mb-4">
              Data yang sudah dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-end">
              <button
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
                onClick={cancelDelete}
              >
                Batal
              </button>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={confirmDelete}
              >
                Ya, hapus data ini!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCrud;
