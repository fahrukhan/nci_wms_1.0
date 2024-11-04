import { db } from "@/drizzle/drizzle";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";
import {
  relocations,
  relocation_details,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  products,
  locations,
  units,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const originLocation = alias(locations, "originLocation");
  const destinationLocation = alias(locations, "destinationLocation");

  try {
    const relocation = await db
      .select({
        relocation_id: relocations.relocation_id,
        relocation_date: relocations.relocation_date,
        origin_name: originLocation.name,
        destination_name: destinationLocation.name,
        ref: relocations.ref,
        note: relocations.note,
        user_name: users.username,
      })
      .from(relocations)
      .leftJoin(
        originLocation,
        eq(originLocation.location_id, relocations.origin_id)
      )
      .leftJoin(
        destinationLocation,
        eq(destinationLocation.location_id, relocations.destination_id)
      )
      .leftJoin(users, eq(relocations.user_id, users.id))
      .where(eq(relocations.relocation_id, id));

    if (relocation.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Relocation not found",
          data: {},
        },
        { status: 404 }
      );
    }

    const detail = await db
      .select({
        product_name: products.name,
        product_code: products.product_code,
        item_id: relocation_details.item_id,
        unit_name: units.name,
        unit_symbol: units.symbol,
      })
      .from(relocation_details)
      .leftJoin(
        products,
        eq(relocation_details.product_id, products.product_id)
      )
      .leftJoin(units, eq(products.unit_base_id, units.unit_id))
      .where(eq(relocation_details.relocation_id, id));

    const detailWithQty = detail.map((item) => ({
      product_name: item.product_name,
      product_code: item.product_code,
      unit_name: item.unit_name,
      unit_symbol: item.unit_symbol,
      qty: item.item_id.split(",").length,
    }));

    const data = {
      transfer_id: relocation[0].relocation_id,
      transfer_date: relocation[0].relocation_date.toISOString().split("T")[0],
      destination_name: relocation[0].destination_name,
      origin_name: relocation[0].origin_name,
      admin_name: relocation[0].user_name,
      ref: relocation[0].ref,
      note: relocation[0].note,
      detail: detailWithQty,
    };

    return NextResponse.json({
      status: 200,
      status_message: "Relocation data retrieved",
      data: data,
    });
  } catch (error: any) {
    console.error("Error retrieving relocation:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve relocation",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
