"use server";

import {
  Location,
  NewLocation,
} from "@/drizzle/schema/MasterData/locations.schema";
import { Warehouse } from "@/drizzle/schema/MasterData/warehouses.schema";
import { getHeaders } from "@/lib/utils/GetHeaders";
import { LocationDTO } from "@/types/Master/LocationDto";
import { revalidatePath } from "next/cache";

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/warehouse`,
    {
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to retrieve warehouses: ${response.statusText}`);
  }

  const { data } = await response.json();
  return data;
}

export async function fetchLocations(
  page: number,
  perPage: number,
  search: string
): Promise<{ data: LocationDTO[]; pagination: Pagination }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/location?page=${page}&perPage=${perPage}&search=${search}`,
    {
      headers: await getHeaders(),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  const { data, pagination } = await response.json();
  return { data, pagination };
}

export async function createLocation(data: NewLocation) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/location`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create location: ${response.statusText}`);
  }

  revalidatePath("/master/location");
  return response.json();
}

export async function updateLocation(data: Location) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/location/${data.location_id}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update location: ${response.statusText}`);
  }

  revalidatePath("/master/location");
  return response.json();
}

export async function deleteLocation(location_id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/location/${location_id}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    const res = await response.json();
    throw new Error(`Failed to delete location: ${res.message}`);
  }

  revalidatePath("/master/location");
  return response.json();
}

export async function fetchLocationsByWarehouse(
  warehouseId: number
): Promise<LocationDTO[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/location?warehouseId=${warehouseId}`,
    {
      headers: await getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve locations by warehouse: ${response.statusText}`
    );
  }

  const { data } = await response.json();
  return data;
}
