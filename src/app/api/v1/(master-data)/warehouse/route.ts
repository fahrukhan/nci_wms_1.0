import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/drizzle";
import {
  companies,
  locations,
  NewWarehouse,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { asc, eq, or, sql } from "drizzle-orm";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";

export async function GET(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const offset = (page - 1) * perPage;
    const searchTerm = searchParams.get("search") || "";

    const allWarehouses = await db
      .select()
      .from(warehouses)
      .where(
        or(
          sql`${warehouses.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${warehouses.phone} ILIKE ${`%${searchTerm}%`}`,
          sql`${warehouses.address} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .orderBy(asc(warehouses.name))
      .offset(offset)
      .limit(perPage);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(warehouses)
      .where(
        or(
          sql`${warehouses.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${warehouses.phone} ILIKE ${`%${searchTerm}%`}`,
          sql`${warehouses.address} ILIKE ${`%${searchTerm}%`}`
        )
      );

    const totalCount = Number(totalCountResult[0].count);
    return NextResponse.json({
      status: "200",
      status_message: "Warehouses data retrieved",
      data: allWarehouses,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving warehouses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve warehouses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newWarehouse: NewWarehouse = await request.json();

    // Check for all required fields
    if (!newWarehouse.name || !newWarehouse.address || !newWarehouse.phone) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input all the required fields",
          data: {},
        },
        { status: 400 }
      );
    }

    // Check for existing warehouse
    const existingData = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.name, newWarehouse.name))
      .limit(1);

    if (existingData.length > 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Warehouse already exists",
          data: {},
        },
        { status: 400 }
      );
    }

    const companyId = await db
      .select({ id: companies.company_id })
      .from(companies)
      .orderBy(companies.name)
      .limit(1)
      .then((res) => res[0].id);

    // Start a transaction
    await db.transaction(async (trx) => {
      // Insert new warehouse into the database
      const createdWarehouse = await trx
        .insert(warehouses)
        .values({ ...newWarehouse, company_id: companyId })
        .returning();

      // Check if warehouse creation was successful
      if (createdWarehouse.length === 0) {
        throw new Error("Warehouse creation failed");
      }

      // Insert default location for the new warehouse
      const createdLocation = await trx
        .insert(locations)
        .values({
          name: "default",
          parent_id: 0,
          path: "",
          pathName: "/default",
          warehouse_id: createdWarehouse[0].warehouse_id,
        })
        .returning();

      const createdLocationId = createdLocation[0].location_id;

      await trx
        .update(locations)
        .set({ path: `${createdLocationId}` })
        .where(eq(locations.location_id, createdLocationId))
        .returning();

      // Check if location creation was successful
      if (createdLocation.length === 0) {
        throw new Error("Location creation failed");
      }
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Warehouse created successfully",
        data: {
          name: newWarehouse.name,
          phone: newWarehouse.phone,
          address: newWarehouse.address,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating warehouse or location:", error);
    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 }
    );
  }
}
