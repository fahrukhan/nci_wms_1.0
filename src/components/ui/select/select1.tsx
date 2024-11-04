import { IoMdArrowDropdown } from "react-icons/io";
import cx from "classnames";
import { useSelect } from "downshift";

interface SelectItem {
  id: string;
  label: any;
}

interface CustomSelectProps {
  items: SelectItem[];
  value?: string;
  onUpdate?: (value: string) => void;
  placeholder: string;
  id: string;

}

export default function Select1({
  items,
  value,
  onUpdate,
  placeholder,id
}: Readonly<CustomSelectProps>) {
  const selectedValueItem = items.find((item) => item.label === value);

  function itemToString(item: SelectItem | null) {
    return item ? item.label : "";
  }

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    itemToString,
    selectedItem: selectedValueItem,
    onSelectedItemChange: ({ selectedItem }) => {
      onUpdate && onUpdate(selectedItem ? selectedItem.label : "");
    },
  });

  return (
    <div id={id}>
      <div className="flex w-full flex-col gap-1">
        <div
          className="flex border-[#EBEEF2] border-2 rounded-[10px] cursor-pointer items-center gap-4 p-2"
          {...getToggleButtonProps()}
        >
        
          <span>{selectedItem ? selectedItem.label : placeholder}</span>
          <IoMdArrowDropdown
            className={`${isOpen ? "rotate-90" : ""}`}
            size={15}
          />
        </div>
      </div>
      <ul
        className={`absolute border-blue-300  border-1 z-10 max-h-80 w-56 rounded-[10px] space-y-1 bg-white p-2 shadow-tab ${
          !isOpen && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cx(
                " flex rounded-md cursor-pointer flex-col border-b border-[#E7E7E7] px-3 py-2",
                highlightedIndex === index && "bg-blue-300",
                selectedItem === item && "font-bold"
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
