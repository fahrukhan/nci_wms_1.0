import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/drizzle";
import { contacts } from "@/drizzle/schema/MasterData/masterData.schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
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

    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const searchTerm = searchParams.get("search") || "";

    const offset = (page - 1) * perPage;
    const allContacts = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.type, "customer"),
          or(
            ilike(contacts.name, `%${searchTerm}%`),
            ilike(contacts.address, `%${searchTerm}%`),
            ilike(contacts.phone, `%${searchTerm}%`)
          )
        )
      )
      .orderBy(contacts.name)
      .offset(offset)
      .limit(perPage);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(contacts)
      .where(
        and(
          eq(contacts.type, "customer"),
          or(
            ilike(contacts.name, `%${searchTerm}%`),
            ilike(contacts.address, `%${searchTerm}%`),
            ilike(contacts.phone, `%${searchTerm}%`)
          )
        )
      );

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Customer data retrieved",
      data: allContacts,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve customer" },
      { status: 500 }
    );
  }
}
