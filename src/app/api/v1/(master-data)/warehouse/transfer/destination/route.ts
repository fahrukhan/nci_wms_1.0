import { db } from "@/drizzle/drizzle";
import { warehouses } from "@/drizzle/schema/MasterData/masterData.schema";
import { transfers } from "@/drizzle/schema/Transaction/transaction.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .selectDistinct({ id: warehouses.warehouse_id, name: warehouses.name })
      .from(warehouses)
      .innerJoin(
        transfers,
        eq(warehouses.warehouse_id, transfers.destination_id)
      );

    return NextResponse.json(
      {
        status: 200,
        status_message: "destination warehouse data retrieved",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving destination warehouse:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve destination warehouse",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
