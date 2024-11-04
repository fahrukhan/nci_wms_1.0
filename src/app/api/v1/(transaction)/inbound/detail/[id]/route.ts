import { db } from "@/drizzle/drizzle";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  inbounds,
  inbound_details,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  products,
  warehouses,
  contacts,
  units,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const inbound = await db
      .select({
        inbound_id: inbounds.inbound_id,
        inbound_date: inbounds.inbound_date,
        warehouse_name: warehouses.name,
        supplier_name: contacts.name,
        ref: inbounds.ref,
        note: inbounds.note,
        user_name: users.username,
      })
      .from(inbounds)
      .leftJoin(warehouses, eq(inbounds.warehouse_id, warehouses.warehouse_id))
      .leftJoin(contacts, eq(inbounds.supplier_id, contacts.contact_id))
      .leftJoin(users, eq(inbounds.user_id, users.id))
      .where(eq(inbounds.inbound_id, id));

    if (inbound.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Inbound not found",
          data: {},
        },
        { status: 404 }
      );
    }

    const detail = await db
      .select({
        product_name: products.name,
        product_code: products.product_code,
        item_id: inbound_details.item_id,
        unit_name: units.name,
        unit_symbol: units.symbol,
      })
      .from(inbound_details)
      .leftJoin(products, eq(inbound_details.product_id, products.product_id))
      .leftJoin(units, eq(products.unit_base_id, units.unit_id))
      .where(eq(inbound_details.inbound_id, id));

    const detailWithQty = detail.map((item) => ({
      product_name: item.product_name,
      product_code: item.product_code,
      unit_name: item.unit_name,
      unit_symbol: item.unit_symbol,
      qty: item.item_id.split(",").length,
    }));

    const data = {
      inbound_id: inbound[0].inbound_id,
      inbound_date: inbound[0].inbound_date.toISOString().split("T")["0"],
      supplier_name: inbound[0].supplier_name,
      warehouse_name: inbound[0].warehouse_name,
      admin_name: inbound[0].user_name,
      ref: inbound[0].ref,
      note: inbound[0].note,
      detail: detailWithQty,
    };

    return NextResponse.json({
      status: 200,
      status_message: "Inbound data retrieved",
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving inbound:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve inbound",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
