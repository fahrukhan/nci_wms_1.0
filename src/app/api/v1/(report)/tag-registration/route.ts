import { db } from "@/drizzle/drizzle";
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { item_logs } from "@/drizzle/schema/MasterData/itemLogs.schema";
import { users } from "@/drizzle/schema/UserManagement/users.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");
    const offset = (page - 1) * perPage;

    const searchTerm = searchParams.get("search") || "";

    const regLogs = await db
      .select({
        item_id: item_logs.item_id,
        note: item_logs.note,
        ref: item_logs.ref,
        user_name: users.username,
        created_at: item_logs.created_at,
      })
      .from(item_logs)
      .where(
        and(
          eq(item_logs.activity, "tag-register"),
          sql`${item_logs.note} ILIKE ${`%${searchTerm}%`}`
        )
      )
      .leftJoin(users, eq(users.id, item_logs.user_id))
      .orderBy(desc(item_logs.created_at))
      .limit(perPage)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(item_logs)
      .where(
        and(
          eq(item_logs.activity, "tag-register"),
          sql`${item_logs.note} ILIKE ${`%${searchTerm}%`}`
        )
      );

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Tag registration logs",
      data: regLogs,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error) {
    console.error("Error retrieving tag registration logs:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve tag registration logs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
