import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CustomFormInputProps {
  title: string;
  type: "text" | "number" | "email" | "password" | "select";
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

export function CustomFormInput({
  title,
  type,
  value,
  onChange,
  className = "",
  placeholder = "",
  options = [],
  required = false,
  disabled = false,
}: CustomFormInputProps) {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Select onValueChange={onChange} value={value} disabled={disabled}>
            <SelectTrigger className={`col-span-3 ${className}`}>
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
        );
      default:
        return (
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`col-span-3 ${className}`}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={title} className="text-left">
        {title}
      </Label>
      {renderInput()}
    </div>
  );
}
