interface CheckboxFormInputProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function CheckboxFormInput({
  options,
  value,
  onChange,
  className = "",
}: CheckboxFormInputProps) {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <div className="col-span-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => {
                const checked = e.target.checked;
                const newValue = checked
                  ? [...value, option.value]
                  : value.filter((v) => v !== option.value);
                onChange(newValue);
              }}
            />
            <label
              htmlFor={option.value}
              className="ml-2 text-sm py-[2px] text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
