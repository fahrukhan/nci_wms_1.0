import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchUserMenu } from "@/app/actions/userActions";
import { FaChevronDown } from "react-icons/fa";
import {
  RectangleGroupIcon,
  ServerStackIcon,
  DocumentChartBarIcon,
  InboxArrowDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface Menu2DTO {
  menu_id: number;
  name: string;
  parent: string;
  url_menu: string;
  sort: number;
}

const iconMap: Record<string, React.ElementType> = {
  Dashboard: RectangleGroupIcon,
  Master: ServerStackIcon,
  Report: DocumentChartBarIcon,
  Transaction: InboxArrowDownIcon,
  "User-Management": Cog6ToothIcon,
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const NewNavbar: React.FC = () => {
  const [menuItems, setMenuItems] = useState<Menu2DTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadUserMenu = async () => {
      try {
        setLoading(true);
        const menuData = await fetchUserMenu();
        setMenuItems(menuData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadUserMenu();
  }, []);

  const parentMenus = Array.from(
    new Set(menuItems.map((item) => capitalize(item.parent)))
  );

  const renderMenuItem = (category: string) => {
    const isActive =
      category === "Dashboard"
        ? pathname === "/"
        : pathname.startsWith(`/${category.toLowerCase()}`);
    const Icon = iconMap[category] || RectangleGroupIcon;
    const hasChildren = menuItems.some(
      (item) => capitalize(item.parent) === category
    );

    const handleClick = () => {
      if (category === "Dashboard") {
        window.location.href = "/"; // Navigate to root for Dashboard
      } else {
        setActiveCategory(activeCategory === category ? null : category);
      }
    };

    return (
      <div key={category} className="relative">
        <button
          onClick={handleClick}
          className={`group flex items-center text-[12px] space-x-2 p-2 px-4 rounded-[30px] focus:outline-none ${
            isActive
              ? "bg-[#2240B0] text-white shadow-md"
              : "bg-white text-black hover:bg-gray-100"
          } focus:ring-2 focus:ring-gray-300`}
          autoFocus={isActive}
        >
          <Icon
            className={`h-6 w-6 ${isActive ? "text-white" : "text-gray-500"}`}
          />
          <span className="lg:block hidden">{category}</span>
          {hasChildren && (
            <FaChevronDown
              className={`h-3 w-3 transition-transform ${
                isActive ? "text-white rotate-0" : "text-gray-500 -rotate-90"
              } group-focus:rotate-0`}
            />
          )}
        </button>
      </div>
    );
  };

  return (
    <div>
      <nav className="bg-white p-3">
        <div className="flex space-x-4 justify-center">
          {renderMenuItem("Dashboard")}
          {parentMenus.map((category) => renderMenuItem(category))}
        </div>
      </nav>
      {activeCategory && (
        <div className="w-full bg-white ">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {menuItems
                .filter((item) => capitalize(item.parent) === activeCategory)
                .sort((a, b) => a.sort - b.sort)
                .map((item) => (
                  <a
                    key={item.menu_id}
                    href={item.url_menu}
                    className="p-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
                  >
                    {capitalize(item.name)}
                  </a>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
