interface UserDTO {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  role_id: number;
  warehouse_ids: number[];
}

interface MenuUserDTO {
  menu_id: number;
  name: string;
  parent: string;
  url_menu: string;
  children: MenuUserDTO[];
}
