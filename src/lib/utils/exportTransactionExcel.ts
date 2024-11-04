import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Column {
  header: string;
  key: string;
  width: number;
}

export async function exportTransactionExcel<T>(
  data: T[],
  columns: Column[],
  fileName: string
) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = columns;

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

    data.forEach((item, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        ...item,
      });

      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    const now = new Date();
    const formattedDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");
    const formattedTime =
      String(now.getHours()).padStart(2, "0") +
      "-" +
      String(now.getMinutes()).padStart(2, "0") +
      "-" +
      String(now.getSeconds()).padStart(2, "0");
    const fullFileName = `${fileName}_${formattedDate}_${formattedTime}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fullFileName);
  } catch (error) {
    console.error(`Failed to export ${fileName}:`, error);
  }
}
