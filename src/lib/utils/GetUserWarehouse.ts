"use server";
import { cookies } from "next/headers";

// Helper function to get user warehouses
export const getUserWarehouses = async () => {
  const cookieStore = cookies();
  const warehouses = cookieStore.get("warehouses")?.value;

  const parsedWarehouses = warehouses ? JSON.parse(warehouses) : [];

  const transformedData = parsedWarehouses.map((item: any) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  return transformedData;
};

