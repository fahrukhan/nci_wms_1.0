import { db } from "@/drizzle/drizzle";
import { attributes } from "@/drizzle/schema/MasterData/attributes.schema";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    const product = await db
      .select()
      .from(products)
      .where(eq(products.product_id, productId));
    if (product.length < 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Product not found",
          data: [],
        },
        { status: 404 }
      );
    }

    const allItems = await db
      .select({
        attribute1: items.attribute1_value,
        attribute2: items.attribute2_value,
        attribute3: items.attribute3_value,
      })
      .from(items)
      .where(
        and(
          eq(items.warehouse_id, warehouseId),
          eq(items.product_id, productId),
          eq(items.in_stock, true)
        )
      );
    const allAttribute: { attribute: string; stock_qty: number }[] = [];
    allItems.forEach((p) => {
      const attrs = [];
      if (p.attribute1 != null && p.attribute1 != "") attrs.push(p.attribute1);
      if (p.attribute2 != null && p.attribute2 != "") attrs.push(p.attribute2);
      if (p.attribute3 != null && p.attribute3 != "") attrs.push(p.attribute3);

      const attrStr = attrs.join(",");
      if (attrs.length > 0) {
        const existAttributeData = allAttribute.find(
          (a) => a.attribute == attrStr
        );
        if (existAttributeData == undefined) {
          allAttribute.push({ attribute: attrStr, stock_qty: 1 });
        } else {
          existAttributeData.stock_qty++;
        }
      }
    });

    allAttribute.sort((a, b) => (a.attribute < b.attribute ? -1 : 1));

    const data = {
      warehouse: warehouse[0],
      product: product[0],
      attribute_stock: allAttribute,
    };

    return NextResponse.json({
      status: 200,
      status_message: `Current stock ${warehouse[0].name} ~> ${product[0].name}`,
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
