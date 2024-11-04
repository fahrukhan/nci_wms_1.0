interface TableInfoDetailProps {
  title: string;
  value: string;
}

export const TableInfoDetail: React.FC<TableInfoDetailProps> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <span className="text-body w-32">{title}</span>
        <span className="text-body pr-2">:</span>
        <span className="text-body">{value}</span>
      </div>
    </div>
  );
};
