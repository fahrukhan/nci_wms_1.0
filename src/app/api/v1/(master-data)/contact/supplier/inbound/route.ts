import { db } from "@/drizzle/drizzle";
import { contacts } from "@/drizzle/schema/MasterData/masterData.schema";
import { inbounds } from "@/drizzle/schema/Transaction/transaction.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // get data from table contacts using drizzle where type supplier and the supplier id is there in inbounds
    const data = await db
      .selectDistinct({ id: contacts.contact_id, name: contacts.name })
      .from(contacts)
      .where(eq(contacts.type, "supplier"))
      .innerJoin(inbounds, eq(contacts.contact_id, inbounds.supplier_id));

    return NextResponse.json(
      {
        status: 200,
        status_message: "Supplier inbound data retrieved",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving supplier inbound:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve supplier inbound",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
