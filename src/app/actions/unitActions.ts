"use server";

import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchUnits(
  page: number,
  perPage: number,
  search: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/unit?page=${page}&per_page=${perPage}&search=${search}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch units: ${response.statusText}`);
  }
  const { data, pagination } = await response.json();
  return { data, pagination };
}

export async function createUnit(data: { name: string; symbol: string }) {
  const response = await fetch(`${process.env.BASE_URL}/unit`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create unit");
  }

  revalidatePath("/master/unit");
  return response.json();
}

export async function updateUnit(data: {
  id: number;
  name: string;
  symbol: string;
}) {
  const response = await fetch(`${process.env.BASE_URL}/unit/${data.id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update unit");
  }

  revalidatePath("/master/unit");
  return response.json();
}

export async function deleteUnit(id: number) {
  const response = await fetch(`${process.env.BASE_URL}/unit/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete unit");
  }

  revalidatePath("/master/unit");
  return response.json();
}

export async function getUnitsCombo() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/unit`, {
    headers: await getHeaders(),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch units: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
}
