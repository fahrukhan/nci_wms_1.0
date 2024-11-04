import { db } from "@/drizzle/drizzle";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  transfers,
  transfer_details,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  products,
  units,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";
import { alias } from "drizzle-orm/pg-core";
import { use } from "react";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const originWarehouse = alias(warehouses, "originWarehouse");
    const destinationWarehouse = alias(warehouses, "destinationWarehouse");
    const destinationUser = alias(users, "destinationUser");

    const transfer = await db
      .select({
        transfer_id: transfers.transfer_id,
        transfer_date: transfers.transfer_date,
        received_date: transfers.received_date,
        destination_name: destinationWarehouse.name,
        origin_name: originWarehouse.name,
        admin_name: users.username,
        destination_user_name: destinationUser.username,
        ref: transfers.ref,
        note: transfers.note,
      })
      .from(transfers)
      .leftJoin(
        originWarehouse,
        eq(originWarehouse.warehouse_id, transfers.origin_id)
      )
      .leftJoin(
        destinationWarehouse,
        eq(destinationWarehouse.warehouse_id, transfers.destination_id)
      )
      .leftJoin(users, eq(users.id, transfers.origin_user_id))
      .leftJoin(
        destinationUser,
        eq(destinationUser.id, transfers.destination_user_id)
      )
      .where(eq(transfers.transfer_id, id));

    if (transfer.length === 0) {
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
        product_id: transfer_details.product_id,
        item_id: transfer_details.item_id,
        unit_name: units.name,
        unit_symbol: units.symbol,
      })
      .from(transfer_details)
      .leftJoin(products, eq(transfer_details.product_id, products.product_id))
      .leftJoin(units, eq(products.unit_base_id, units.unit_id))
      .where(eq(transfer_details.transfer_id, id));

    const detailWithQty = detail.map((item) => ({
      item_id: item.item_id.split(","),
      product_id: item.product_id,
      product_name: item.product_name,
      product_code: item.product_code,
      unit_name: item.unit_name,
      unit_symbol: item.unit_symbol,
      qty: item.item_id.split(",").length,
    }));

    const data = {
      transfer_id: transfer[0].transfer_id,
      transfer_date: transfer[0].transfer_date.toISOString().split("T")["0"],
      received_date: transfer[0].received_date
        ? transfer[0].received_date.toISOString().split("T")["0"]
        : "",
      destination_name: transfer[0].destination_name,
      origin_name: transfer[0].origin_name,
      admin_name: transfer[0].admin_name,
      destination_user_name: transfer[0].destination_user_name || "",
      transfer_status:
        transfer[0].destination_user_name == null ? "pending" : "complete",
      ref: transfer[0].ref,
      note: transfer[0].note,
      detail: detailWithQty,
    };

    return NextResponse.json({
      status: 200,
      status_message: "Transfer data retrieved",
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving transfer:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve transfer",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
