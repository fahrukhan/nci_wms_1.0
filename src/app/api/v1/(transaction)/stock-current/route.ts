import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { stock_opnames } from "@/drizzle/schema/Transaction/stockOpnames.schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: 200,
      status_message: "Available soon!",
      data: [],
    });

    // const allItems = await db.select().from(items);
    // return NextResponse.json({
    //   status: 200,
    //   status_message: 'Stock data retrieved',
    //   data: allItems,
    // });
  } catch (error: any) {
    console.error("Error retrieving opname:", error);
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
