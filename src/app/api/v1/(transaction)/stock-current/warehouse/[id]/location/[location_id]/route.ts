import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const groupongProduct = (
  productsData: {
    location_id: number | null;
    product_id: number;
    product_name: string;
  }[]
) => {
  let groupedProduct: {
    product_id: number;
    product_name: string;
    stock_qty: number | 0;
  }[] = [];
  productsData.forEach((p) => {
    if (groupedProduct.some((i) => i.product_id == p.product_id)) {
      groupedProduct.find((g) => g.product_id == p.product_id)!.stock_qty += 1;
    } else {
      groupedProduct.push({
        product_id: p.product_id,
        product_name: p.product_name,
        stock_qty: 1,
      });
    }
  });
  groupedProduct.sort((a, b) => (a.product_name < b.product_name ? -1 : 1));
  return groupedProduct;
};

const removeDefault = (pathName: string) => {
  const startStr = "/default";
  if (pathName.startsWith(startStr)) {
    return pathName.substring(startStr.length);
  }
  return pathName;
};

export async function GET(
  request: Request,
  { params }: { params: { id: Number; location_id: Number } }
) {
  const warehouseId = Number(params.id) || 0;
  const locationId = Number(params.location_id) || -1;

  try {
    const warehouse = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.warehouse_id, warehouseId));
    if (warehouse.length < 1) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Warehouse not found",
          data: [],
        },
        { status: 404 }
      );
    }

    const location = await db
      .select({
        location_id: locations.location_id,
        location_path_name: locations.pathName,
        location_name: locations.name,
      })
      .from(locations)
      .where(
        and(
          eq(locations.warehouse_id, warehouseId),
          eq(locations.location_id, locationId)
        )
      );

    if (location.length < 1) {
      return NextResponse.json(
        {
          status: 404,
          status_message: `Location not found`,
          data: [],
        },
        { status: 404 }
      );
    }

    location[0].location_path_name = removeDefault(
      location[0].location_path_name
    );

    const allItems = await db
      .select({
        location_id: items.location_id,
        product_id: items.product_id,
        product_name: sql<string>`${products.name || "#N/A"}`,
      })
      .from(items)
      .where(
        and(
          eq(items.warehouse_id, warehouseId),
          eq(items.location_id, locationId)
        )
      )
      .leftJoin(products, eq(products.product_id, items.product_id));

    const stockLocationData = groupongProduct(allItems);
    const data = {
      warehouse: warehouse[0],
      location: location[0],
      product_stock: stockLocationData,
    };

    return NextResponse.json({
      status: 200,
      status_message: `Current stock ${warehouse[0].name} ~> ${location[0].location_name}`,
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving stock opname:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve stock opname data",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
