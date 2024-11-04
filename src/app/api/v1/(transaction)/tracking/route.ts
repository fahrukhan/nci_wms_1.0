import { db } from "@/drizzle/drizzle";
import { asc, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/drizzle/schema/UserManagement/users.schema";
import { item_logs } from "@/drizzle/schema/MasterData/itemLogs.schema";
import { Item, items } from "@/drizzle/schema/MasterData/items.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id") || "";

    let item = [];

    if (type == "rfid") {
      item = await db
        .select({
          product_id: products.product_id,
          product_name: products.name,
          item_id: items.item_id,
          rfid: items.rfid,
          location_id: locations.location_id || 0,
          location_name: locations.name || "",
          location_path_name: locations.pathName || "",
          history: {},
        })
        .from(items)
        .leftJoin(products, eq(items.product_id, products.product_id))
        .leftJoin(locations, eq(items.location_id, locations.location_id))
        .where(eq(items.rfid, id));
    } else if (type == "qr") {
      item = await db
        .select({
          product_id: products.product_id,
          product_name: products.name,
          item_id: items.item_id,
          rfid: items.rfid,
          location_id: locations.location_id || 0,
          location_name: locations.name || "",
          location_path_name: locations.pathName || "",
          history: {},
        })
        .from(items)
        .leftJoin(products, eq(items.product_id, products.product_id))
        .leftJoin(locations, eq(items.location_id, locations.location_id))
        .where(eq(items.qr, id));
    } else {
      return NextResponse.json(
        {
          status: 400,
          status_message: `Invalid type ${type}`,
        },
        { status: 400 }
      );
    }

    const logs = await db
      .select({
        activity: item_logs.activity,
        note: item_logs.note,
        ref: item_logs.ref,
        user_name: users.username,
        created_at: item_logs.created_at,
      })
      .from(item_logs)
      .leftJoin(users, eq(item_logs.user_id, users.id))
      .where(eq(item_logs.item_id, item[0].item_id))
      .orderBy(desc(item_logs.created_at));

    item[0].history = logs;

    if (Object.keys(item).length == 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: `Not found ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        status_message: "Tracking data for item retrieved",
        data: item,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error tracking item:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to track item",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
