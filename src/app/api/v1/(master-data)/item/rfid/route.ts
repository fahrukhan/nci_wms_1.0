import { db } from "@/drizzle/drizzle";
import {
  items,
  locations,
  products,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { and, eq, inArray, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface Item {
  item_id: string;
  rfid: string;
  location_id: number | null;
  location_name: string | null;
}

interface Product {
  product_id: number | null;
  product_name: string | null;
  item_list: Item[];
}

export async function POST(request: NextRequest) {
  const requestData = await request.json();
  const rfidArray: string[] = requestData.rfid;
  const feature: string = requestData.feature || "default";

  try {

    let condition = and(inArray(items.rfid, rfidArray));
    
    switch(feature){
      case "inbound": {
        condition = and(inArray(items.rfid, rfidArray),eq(items.in_stock, false))
      }
      break;
      case "transfer": {
        condition = and(
          inArray(items.rfid, rfidArray),
          eq(items.in_stock, true),
          eq(items.on_transfer, false)
        )
      }
      break;
      case "relocation": {
        condition = and(
          inArray(items.rfid, rfidArray),
          eq(items.in_stock, true),
          eq(items.on_transfer, false)
        )
      }
      break;
      case "outbound": {
        condition = and(
          inArray(items.rfid, rfidArray),
          eq(items.in_stock, true),
          eq(items.on_transfer, false)
        )
      }
      break;
      default:
      {
        condition = inArray(items.rfid, rfidArray)
      }
    }

    let allItems = await db
      .select({
        product_id: products.product_id,
        product_name: products.name,
        item_id: items.item_id,
        rfid: items.rfid,
        in_stock: items.in_stock,
        on_transfer: items.on_transfer,
        location_id: locations.location_id || 0,
        location_name: locations.name || "",
      })
      .from(items)
      .leftJoin(products, eq(items.product_id, products.product_id))
      .leftJoin(locations, eq(items.location_id, locations.location_id))
      .where(condition);

    const groupedItems = allItems.reduce<Product[]>((acc, item) => {
      const {
        product_id,
        product_name,
        item_id,
        rfid,
        location_id,
        location_name,
      } = item;
      let existingProduct = acc.find((p) => p.product_id === product_id);

      if (existingProduct) {
        existingProduct.item_list.push({
          item_id,
          rfid,
          location_id,
          location_name,
        });
      } else {
        existingProduct = {
          product_id,
          product_name,
          item_list: [{ item_id, rfid, location_id, location_name }],
        };
        acc.push(existingProduct);
      }

      return acc;
    }, []);

    return NextResponse.json({
      status: 200,
      status_message: "Items data retrieved",
      data: groupedItems,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve items",
        data: {},
      },
      { status: 500 }
    );
  }
}
