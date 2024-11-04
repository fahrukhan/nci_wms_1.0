export interface MenuDTO {
  menu_id: number;
  menu_name: string;
  parent: string;
  url_menu: string;
  sort: number;
}

export interface RoleDTO {
  role_id: number;
  role_name: string;
  menu_ids: string;
  menus: string;
}

export interface RoleCreateDTO {
  role_name: string;
  menu_ids: string;
}

export interface RoleUpdateDTO {
  role_id: number;
  role_name: string;
  menu_ids: string;
}
