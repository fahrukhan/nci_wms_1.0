import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/drizzle";
import {
  attributes,
  NewAttribute,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { asc, or, sql } from "drizzle-orm";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";

// Get all attributes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const searchTerm = searchParams.get("search") || "";

    const offset = (page - 1) * perPage;

    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const allAttributes = await db
      .select()
      .from(attributes)
      .where(
        or(
          sql`${attributes.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${attributes.type} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .orderBy(asc(attributes.name));

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(attributes)
      .where(
        or(
          sql`${attributes.name} ILIKE ${`%${searchTerm}%`}`,
          sql`${attributes.type} ILIKE ${`%${searchTerm}%`}`
        )
      );
    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Attributes data retrieved",
      data: allAttributes,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving attributes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve attributes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqData: NewAttribute = await request.json();

    if (!reqData.name || !reqData.type) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Missing required fields",
          data: {},
        },
        { status: 400 }
      );
    }

    const newAttribute = await db
      .insert(attributes)
      .values(reqData)
      .returning();

    return NextResponse.json(
      {
        status: 201,
        status_message: "Attribute created successfully",
        data: newAttribute[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create attribute",
        data: {},
      },
      { status: 500 }
    );
  }
}
