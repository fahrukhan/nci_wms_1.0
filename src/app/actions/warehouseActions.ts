"use server";

import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchWarehouse(
  page: number,
  limit: number,
  search: string
) {
  const response = await fetch(
    `${process.env.BASE_URL}/warehouse?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );

  const { data, pagination } = await response.json();
  return { data, pagination };
}

export async function createWarehouse(data: {
  name: string;
  address: string;
  phone: string;
}) {
  const response = await fetch(`${process.env.BASE_URL}/warehouse`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create warehouse");
  }

  revalidatePath("/master/warehouse");
  return response.json();
}

export async function updateWarehouse(data: {
  id: string;
  name: string;
  address: string;
  phone: string;
}) {
  const response = await fetch(`${process.env.BASE_URL}/warehouse/${data.id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update warehouse");
  }

  revalidatePath("/master/warehouse");
  return response.json();
}

export async function deleteWarehouse(id: string) {
  const response = await fetch(`${process.env.BASE_URL}/warehouse/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete warehouse");
  }

  revalidatePath("/master/warehouse");
  return response.json();
}
