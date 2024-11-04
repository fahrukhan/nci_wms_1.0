import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
  height?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  padding = "px-6",
  style,
  height = "h-10",
}) => (
  <td className={`${height} ${padding}`} style={style}>
    {children}
  </td>
);

export default TableCell;
