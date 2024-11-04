import React from "react";
import { SortIcon } from "../Icons/SortIcon";

interface TableHeaderProps {
  title: string;
  onSort?: () => void;
  sortable?: boolean;
  style?: React.CSSProperties;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  onSort,
  sortable = true,
  style
}) => (
  <th scope="col" className="px-6 py-3">
    <div className="flex items-center justify-start" style={style}>
      {title}
      {sortable && onSort && <SortIcon sortKey={title} requestSort={onSort} />}
    </div>
  </th>
);
