import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Column {
  header: string;
  key: string;
  width: number;
}

const getNestedValue = (
  obj: any,
  path: string,
  defaultValue: any = ""
): any => {
  return path
    .split(".")
    .reduce(
      (acc, part) =>
        acc && acc[part] !== undefined ? acc[part] : defaultValue,
      obj
    );
};

export async function exportToExcel<T>(
  fetchData: (
    page: number,
    pageSize: number,
    query: string
  ) => Promise<{ data: T[] }>,
  columns: Column[],
  fileName: string,
  totalItems: number
) {
  try {
    const { data: allItems } = await fetchData(1, totalItems, "");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width,
    }));

    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFA4C2F4" },
      };
      cell.alignment = { horizontal: "left" };
      cell.border = borderStyle;
    });

    allItems.forEach((item, index) => {
      const rowValues: Record<string, any> = { no: index + 1 };

      columns.forEach((column) => {
        if (column.key !== "no") {
          rowValues[column.key] = getNestedValue(item, column.key);
        }
      });

      const row = worksheet.addRow(rowValues);

      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    const currentDateTime = format(new Date(), "dd-MM-yyyy_HHmmss");
    const fullFileName = `${fileName}_${currentDateTime}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fullFileName);
  } catch (error) {
    console.error(`Failed to export ${fileName}:`, error);
  }
}
