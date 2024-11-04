"use server";

import {
  Contact,
  NewContact,
} from "@/drizzle/schema/MasterData/contacts.schema";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { revalidatePath } from "next/cache";

export async function fetchCustomer(
  page: number,
  perPage: number,
  search: string
): Promise<{ data: Contact[]; pagination: Pagination }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/customer?page=${page}&per_page=${perPage}&search=${search}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.statusText}`);
  }
  const { data, pagination } = await response.json();
  return { data, pagination };
}

export async function fetchSupplier(
  page: number,
  perPage: number,
  search: string
): Promise<{ data: Contact[]; pagination: Pagination }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/supplier?page=${page}&per_page=${perPage}&search=${search}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.statusText}`);
  }
  const { data, pagination } = await response.json();
  revalidatePath("/master/supplier");
  return { data, pagination };
}

export async function createContact(data: NewContact) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/contact`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: ${response.statusText}`);
  }

  revalidatePath("/master/contact");
  revalidatePath("/master/supplier");
  return response.json();
}

export async function updateContact(data: Contact) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/${data.contact_id}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update contact: ${response.statusText}`);
  }

  revalidatePath("/master/contact");
  revalidatePath("/master/supplier");

  return response.json();
}

export async function deleteContact(contact_id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/contact/${contact_id}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }

  revalidatePath("/master/contact");
  revalidatePath("/master/supplier");

  return response.json();
}
