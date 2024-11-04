"use server";

import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchRoles() {
  const response = await fetch(`${process.env.BASE_URL}/role`, {
    headers: await getHeaders(),
  });

  const { data } = await response.json();
  return data;
}

export async function createRoles(data: {
  role_name: string;
  menu_ids: string;
}) {
  const response = await fetch(`${process.env.BASE_URL}/role`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create roles");
  }

  revalidatePath("/master/role");
  return response.json();
}

export async function updateRoles(data: {
  role_id: number;
  role_name: string;
  menu_ids: string;
}) {
  const response = await fetch(`${process.env.BASE_URL}/role/${data.role_id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update roles");
  }

  revalidatePath("/master/role");
  return response.json();
}

export async function deleteRoles(id: string) {
  const response = await fetch(`${process.env.BASE_URL}/role/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete role");
  }

  revalidatePath("/master/role");
  return response.json();
}

export async function fetchMenus() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/menu`, {
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve menus: ${response.statusText}`);
  }

  const { data } = await response.json();
  return data;
}
