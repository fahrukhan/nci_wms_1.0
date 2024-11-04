import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";
import { and, eq, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

const customCount = (column?: AnyPgColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`; // In MySQL cast to unsigned integer
  } else {
    return sql<number>`cast(count(*) as integer)`; // In MySQL cast to unsigned integer
  }
};

const getStock = (
  product_id: number,
  stockList: { product_id: Number | null; stock_qty: number }[]
) => {
  const itemFiltered = stockList.filter((s) => s.product_id === product_id);
  if (itemFiltered.length > 0) {
    return itemFiltered[0].stock_qty;
  }
  return 0;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const warehouseId = Number(params.id) || 0;

  try {
    const warehouse = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.warehouse_id, warehouseId));
    if (warehouse.length < 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Warehouse not found",
          data: [],
        },
        { status: 404 }
      );
    }

    const allItems = await db
      .select({
        product_id: items.product_id,
        stock_qty: customCount(items.item_id),
      })
      .from(items)
      .where(and(eq(items.warehouse_id, warehouseId), eq(items.in_stock, true)))
      .groupBy(items.product_id);

    const allProduct = await db
      .select({
        product_id: products.product_id,
        product_name: products.name,
        stock_qty: sql<Number>`0`,
      })
      .from(products);

    let productStock: {
      product_id: number;
      product_name: string;
      stock_qty: number;
    }[] = [];
    allProduct.forEach((a) => {
      const stock = getStock(a.product_id, allItems);
      if (stock > 0) {
        productStock.push({
          product_id: a.product_id,
          product_name: a.product_name,
          stock_qty: stock,
        });
      }
    });
    productStock.sort((a, b) => (a.product_name < b.product_name ? -1 : 1));

    const data = {
      warehouse: warehouse[0],
      product_stock: productStock,
    };

    return NextResponse.json({
      status: 200,
      status_message: `Current stock ${warehouse[0].name}`,
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving stock:", error);
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
