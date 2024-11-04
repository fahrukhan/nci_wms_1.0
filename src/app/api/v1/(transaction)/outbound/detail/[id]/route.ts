import { db } from "@/drizzle/drizzle";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  outbound_details,
  outbounds,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  contacts,
  products,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const outbound = await db
      .select({
        outbound_id: outbounds.outbound_id,
        outbound_date: outbounds.outbound_date,
        warehouse_name: warehouses.name,
        customer_name: contacts.name,
        ref: outbounds.ref,
        note: outbounds.note,
        user_name: users.username,
      })
      .from(outbounds)
      .leftJoin(warehouses, eq(outbounds.warehouse_id, warehouses.warehouse_id))
      .leftJoin(contacts, eq(outbounds.customer_id, contacts.contact_id))
      .leftJoin(users, eq(outbounds.user_id, users.id))
      .where(eq(outbounds.outbound_id, id));

    if (outbound.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Outbound not found",
          data: {},
        },
        { status: 404 }
      );
    }

    const detail = await db
      .select({
        product_name: products.name,
        item_id: outbound_details.item_id,
      })
      .from(outbound_details)
      .leftJoin(products, eq(outbound_details.product_id, products.product_id))
      .where(eq(outbound_details.outbound_id, id));

    const detailWithQty = detail.map((item) => ({
      product_name: item.product_name,
      qty: item.item_id.split(",").length,
    }));

    const data = {
      outbound_id: outbound[0].outbound_id,
      outbound_date: outbound[0].outbound_date.toISOString().split("T")["0"],
      customer_name: outbound[0].customer_name,
      warehouse_name: outbound[0].warehouse_name,
      admin_name: outbound[0].user_name,
      ref: outbound[0].ref,
      note: outbound[0].note,
      detail: detailWithQty,
    };

    return NextResponse.json({
      status: 200,
      status_message: "Outbound data retrieved",
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving outbound:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve outbound",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
