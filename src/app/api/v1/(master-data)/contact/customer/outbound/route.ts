import { db } from "@/drizzle/drizzle";
import { contacts } from "@/drizzle/schema/MasterData/masterData.schema";
import { outbounds } from "@/drizzle/schema/Transaction/transaction.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // get data from table contacts where type customer and the customer_id is there in outbounds
    const data = await db
      .selectDistinct({ id: contacts.contact_id, name: contacts.name })
      .from(contacts)
      .where(eq(contacts.type, "customer"))
      .innerJoin(outbounds, eq(contacts.contact_id, outbounds.customer_id));

    return NextResponse.json(
      {
        status: 200,
        status_message: "customer data retrieved",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving customer:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve customer",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
