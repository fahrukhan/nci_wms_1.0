"use server";

import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchUsers() {
  const response = await fetch(`${process.env.BASE_URL}/user`, {
    headers: await getHeaders(),
  });

  const { data } = await response.json();
  return data;
}

interface Menu2DTO {
  menu_id: number;
  name: string;
  parent: string;
  url_menu: string;
  sort: number;
}

export async function fetchUserMenu(): Promise<Menu2DTO[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/menu`,
    {
      headers: await getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch menus: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.status !== 200) {
    throw new Error(data.status_message || "Failed to fetch menus");
  }
  return data.data;
}

export async function fetchAllMenus(): Promise<MenuUserDTO[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/menu`, {
    headers: await getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menus");
  }
  return response.json();
}

export async function createUsers(data: {
  email: string;
  password: string;
  phone: string;
  username: string;
  role_id: number;
  warehouse_ids: number[];
}) {
  const response = await fetch(`${process.env.BASE_URL}/create-user`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create warehouse");
  }

  revalidatePath("/master/user");
  return response.json();
}

export async function updateUsers(data: {
  id: string;
  email: string;
  password: string;
  phone: string;
  username: string;
  role_id: number;
  warehouse_ids: number[];
}) {
  const response = await fetch(`${process.env.BASE_URL}/user/${data.id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update warehouse");
  }

  revalidatePath("/master/user");
  return response.json();
}

export async function deleteUsers(id: string) {
  const response = await fetch(`${process.env.BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete warehouse");
  }

  revalidatePath("/master/user");
  return response.json();
}
