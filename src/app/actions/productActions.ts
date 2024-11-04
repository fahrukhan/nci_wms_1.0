"use server";

import {
  NewProduct,
  Product,
} from "@/drizzle/schema/MasterData/products.schema";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchProducts(page: number, perPage: number, search: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/product?page=${page}&perPage=${perPage}&search=${search}`,
      {
        headers: await getHeaders(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const { data, pagination } = await response.json();
    return { data, pagination };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      pagination: { currentPage: 1, perPage, totalItems: 0, totalPages: 0 },
    };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/product`, {
      method: "POST",
      headers: await getHeaders(true),
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const result = await response.json();
    revalidatePath("/master/product");
    return result;
  } catch (error) {
    console.error("Error in createProduct action:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(data: Product) {
  const response = await fetch(
    `${process.env.BASE_URL}/product/${data.product_id}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  revalidatePath("/master/product");
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${process.env.BASE_URL}/product/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  revalidatePath("/master/product");
  return response.json();
}
