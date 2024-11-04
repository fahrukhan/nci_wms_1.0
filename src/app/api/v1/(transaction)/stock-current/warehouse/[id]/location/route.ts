import { db } from "@/drizzle/drizzle";
import { attributes } from "@/drizzle/schema/MasterData/attributes.schema";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const groupingProduct = (
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
  { params }: { params: { id: string; product_id: string } }
) {
  const warehouseId = Number(params.id) || 0;
  const productId = Number(params.product_id) || 0;

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
        location_name: locations.name,
        location_path_name: locations.pathName,
      })
      .from(locations)
      .where(eq(locations.warehouse_id, warehouseId));

    if (location.length < 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: `${warehouse[0].name} have no location`,
          data: [],
        },
        { status: 404 }
      );
    }

    const locationIds = location.map((l) => l.location_id);

    const allItems = await db
      .select({
        location_id: items.location_id,
        product_id: items.product_id,
        product_name: sql<string>`${products.name || "#N/A"}`,
      })
      .from(items)
      .where(
        and(
          //eq(items.in_stock, true),
          eq(items.warehouse_id, warehouseId),
          inArray(items.location_id, locationIds)
        )
      )
      .leftJoin(products, eq(products.product_id, items.product_id));

    const stockLocationData: {
      location_id: number;
      location_name: string;
      location_path_name: string;
      stock_qty: number;
    }[] = [];
    location.forEach((l) => {
      if (allItems.some((i) => i.location_id == l.location_id)) {
        const itemFiltered = allItems.filter(
          (i) => i.location_id == l.location_id
        );
        const groupingProducts = groupingProduct(itemFiltered);
        const locationQty = groupingProducts.reduce(
          (a, b) => a + (b.stock_qty || 0),
          0
        );

        stockLocationData.push({
          location_id: l.location_id,
          location_name: l.location_name,
          location_path_name:
            warehouse[0].name + removeDefault(l.location_path_name),
          stock_qty: locationQty,
        });
      }
    });

    const data = {
      warehouse: warehouse[0],
      location_stock: stockLocationData,
    };

    return NextResponse.json({
      status: 200,
      status_message: `Current stock ${warehouse[0].name} each location`,
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving stock data:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve stock data",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
