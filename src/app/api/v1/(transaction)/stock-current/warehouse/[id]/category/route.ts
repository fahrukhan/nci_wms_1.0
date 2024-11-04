import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";
import { stock_opnames } from "@/drizzle/schema/Transaction/stockOpnames.schema";
import { count } from "console";
import { and, eq, sql } from "drizzle-orm";
import { AnyPgColumn, PgColumn } from "drizzle-orm/pg-core";
import { Warehouse } from "lucide-react";
import { NextResponse } from "next/server";
import { number } from "zod";

const customCount = (column?: AnyPgColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`; // In MySQL cast to unsigned integer
  } else {
    return sql<number>`cast(count(*) as integer)`; // In MySQL cast to unsigned integer
  }
};

const getStock = (
  warehouseId: number,
  stockList: { warehouse_id: Number | null; stock_qty: number }[]
) => {
  const itemFiltered = stockList.filter((s) => s.warehouse_id === warehouseId);
  if (itemFiltered.length > 0) {
    return itemFiltered[0].stock_qty;
  }
  return 0;
};

export async function GET() {
  try {
    const allItems = await db
      .select({
        warehouse_id: items.warehouse_id,
        stock_qty: customCount(items.item_id),
      })
      .from(items)
      .where(eq(items.in_stock, true))
      .leftJoin(warehouses, eq(items.warehouse_id, warehouses.warehouse_id))
      .groupBy(items.warehouse_id);

    const allWarehouse = await db
      .select({
        warehouse_id: warehouses.warehouse_id,
        warehouse_name: warehouses.name,
        stock_qty: sql<Number>`0`,
      })
      .from(warehouses);

    allWarehouse.forEach((a) => {
      a.stock_qty = getStock(a.warehouse_id, allItems);
    });

    return NextResponse.json({
      status: 200,
      status_message: "Current stock each warehouse",
      data: allWarehouse,
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
