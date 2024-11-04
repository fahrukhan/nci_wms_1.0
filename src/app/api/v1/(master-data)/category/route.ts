import { db } from "@/drizzle/drizzle";
import {
  categories,
  NewCategory,
} from "@/drizzle/schema/MasterData/masterData.schema";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { asc, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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

    const allCategories = await db
      .select()
      .from(categories)
      .where(or(sql`${categories.name} ILIKE ${`%${searchTerm}%`}`))
      .orderBy(asc(categories.name))
      .offset(offset)
      .limit(perPage);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(categories)
      .where(or(sql`${categories.name} ILIKE ${`%${searchTerm}%`}`));

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Categories data retrieved",
      data: allCategories,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const newCategory: NewCategory = await request.json();

    if (!newCategory.name) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input category name",
          data: "",
        },
        { status: 400 }
      );
    }

    await db.insert(categories).values(newCategory);

    return NextResponse.json(
      {
        status: 201,
        status_message: "Category created",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve categories" },
      { status: 500 }
    );
  }
}
