import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/drizzle";
import { NewUnit, units } from "@/drizzle/schema/MasterData/masterData.schema";
import { asc, eq, or, sql } from "drizzle-orm";

// Get all units
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const searchTerm = searchParams.get("search") || "";

    const offset = (page - 1) * perPage;

    const allUnits = await db
      .select()
      .from(units)
      .where(
        or(
          sql`${units.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${units.symbol} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .orderBy(asc(units.name))
      .offset(offset)
      .limit(perPage);
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(units)
      .where(
        or(
          sql`${units.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${units.symbol} ILIKE ${`%${searchTerm}%`}`
        )
      );
    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Units data retrieved",
      data: allUnits,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving units:", error);
    return NextResponse.json(
      { error: "Failed to retrieve units" },
      { status: 500 }
    );
  }
}

// Create a unit
export async function POST(request: NextRequest) {
  try {
    const newUnit: NewUnit = await request.json();

    if (!newUnit.name || !newUnit.symbol) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input all the required fields",
          data: {},
        },
        { status: 400 }
      );
    }

    const existingUnit = await db
      .select()
      .from(units)
      .where(eq(units.symbol, newUnit.symbol))
      .limit(1);

    if (existingUnit.length > 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Unit already exists",
          data: {},
        },
        { status: 400 }
      );
    }

    const createdUnit = await db.insert(units).values(newUnit).returning();

    return NextResponse.json(
      {
        status: 201,
        status_message: "Unit created successfully",
        data: createdUnit[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    );
  }
}
