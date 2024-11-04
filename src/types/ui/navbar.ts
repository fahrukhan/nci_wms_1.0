import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  current: boolean;
  category?: string[];
}

export interface NavbarProps {
  onCategorySelect: (item: NavigationItem) => void;
}

export interface SubItem {
  name: string;
}

export interface ActiveItem {
  category: string[];
  href: string;
}

export interface CategoryNavbarProps {
  activeItem: ActiveItem;
}
