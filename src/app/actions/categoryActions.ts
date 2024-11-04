"use server";

import {
  Category,
  NewCategory,
} from "@/drizzle/schema/MasterData/categories.schema";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function fetchCategories(
  page: number,
  perPage: number,
  searchTerm: string
): Promise<{ data: Category[]; pagination: Pagination }> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/category?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, pagination: result.pagination };
}

export async function createCategory(data: NewCategory) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create categories: ${response.statusText}`);
  }

  revalidatePath("/master/category");
  return response.json();
}

export async function updateCategory(data: Category) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/category/${data.category_id}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update category: ${response.statusText}`);
  }

  revalidatePath("/master/category");
  return response.json();
}

export async function deleteCategory(category_id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/category/${category_id}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${response.statusText}`);
  }

  revalidatePath("/master/category");
  return response.json();
}

export async function getCategoriesCombo() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
    headers: await getHeaders(),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
}
