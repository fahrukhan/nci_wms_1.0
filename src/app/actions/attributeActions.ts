"use server";

import {
  Attribute,
  NewAttribute,
} from "@/drizzle/schema/MasterData/attributes.schema";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { AttributeDTO, fromAttributeDTO } from "@/types/Master/AttributeDto";
import { revalidatePath } from "next/cache";

export async function fetchAttributes(
  page: number,
  perPage: number,
  searchTerm: string
): Promise<{ data: Attribute[]; pagination: Pagination }> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/attribute?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
      searchTerm
    )}`,
    {
      headers: await getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch attributes: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, pagination: result.pagination };
}

export async function createAttribute(data: NewAttribute) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attribute`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create attribute: ${response.statusText}`);
  }

  revalidatePath("/master/attribute");
  return response.json();
}

export async function updateAttribute(data: AttributeDTO) {
  const attributeData = fromAttributeDTO(data);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attribute/${attributeData.attribute_id}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(attributeData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update attribute: ${response.statusText}`);
  }

  revalidatePath("/master/attribute");
  return response.json();
}

export async function deleteAttribute(attribute_id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attribute/${attribute_id}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete attribute: ${response.statusText}`);
  }

  revalidatePath("/master/attribute");
  return response.json();
}

export async function getAttributesCombo() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attribute`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch attributes: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
}
