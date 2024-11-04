import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/drizzle";
import {
  locations,
  NewLocation,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const offset = (page - 1) * perPage;
  const warehouseId = searchParams.get("warehouseId");
  const searchTerm = searchParams.get("search") || "";

  try {
    const whereConditions = [];
    if (warehouseId) {
      whereConditions.push(eq(locations.warehouse_id, parseInt(warehouseId)));
    }
    if (searchTerm) {
      whereConditions.push(
        or(
          ilike(locations.name, `%${searchTerm}%`),
          ilike(warehouses.name, `%${searchTerm}%`),
          ilike(locations.path, `%${searchTerm}%`)
        )
      );
    }

    const query = db
      .select({
        location_id: locations.location_id,
        name: locations.name,
        parent_id: locations.parent_id,
        path: locations.path,
        pathName: locations.pathName,
        warehouse_id: locations.warehouse_id,
        warehouse_name: warehouses.name,
      })
      .from(locations)
      .leftJoin(warehouses, eq(locations.warehouse_id, warehouses.warehouse_id))
      .orderBy(asc(locations.name))
      .offset(offset)
      .limit(perPage);

    if (whereConditions.length > 0) {
      query.where(and(...whereConditions));
    }

    const allLocations = await query;

    const totalCountQuery = db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(locations)
      .leftJoin(
        warehouses,
        eq(locations.warehouse_id, warehouses.warehouse_id)
      );

    if (whereConditions.length > 0) {
      totalCountQuery.where(and(...whereConditions));
    }

    const totalCountResult = await totalCountQuery;
    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Locations data retrieved",
      data: allLocations,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving locations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: NewLocation = await request.json();

    if (!requestData.name || !requestData.warehouse_id) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input all the required fields",
          data: {},
        },
        { status: 400 }
      );
    }

    const parentData = await db
      .select({ path: locations.path, pathName: locations.pathName })
      .from(locations)
      .where(eq(locations.location_id, requestData.parent_id as number))
      .limit(1);

    let pathCombination = parentData[0].path;
    let pathName = `${parentData[0].pathName}/${requestData.name}`;

    const newLocation: NewLocation = {
      name: requestData.name,
      warehouse_id: requestData.warehouse_id,
      parent_id: requestData.parent_id ?? null,
      pathName: pathName,
    };

    const createdLocation = await db
      .insert(locations)
      .values(newLocation)
      .returning();
    const createdLocationId = createdLocation[0].location_id;

    const data = await db
      .update(locations)
      .set({
        path: `${pathCombination}.${createdLocationId}`,
      })
      .where(eq(locations.location_id, createdLocationId))
      .returning();

    return NextResponse.json(
      {
        status: 201,
        status_message: "Location created successfully",
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
