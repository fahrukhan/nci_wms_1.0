import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "w-[180px]",
}) => (
  <div className="flex flex-col">
    <label className="mb-2 text-sm text-gray-500">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
