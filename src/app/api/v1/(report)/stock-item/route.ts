import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { createUnauthorizedResponse, getUserFromSession, validateBearerToken } from "@/lib/utils/AuthUtils";
import { NextRequest, NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { warehouses } from "@/drizzle/schema/MasterData/warehouses.schema";

export async function GET(request: NextRequest) {
    try {
        const session = await validateBearerToken(request);
        if (!session) {
            return createUnauthorizedResponse('Missing or invalid bearer token');
        }

        const user = await getUserFromSession(session);
        if (!user) {
            return createUnauthorizedResponse('User not found');
        }

        const groupedItems = await db
            .select({
                warehouse_id: items.warehouse_id,
                warehouse_name: warehouses.name,
                count : sql<number>`cast(count(${items.item_id}) as integer)`,
            })
            .from(items)
            .innerJoin(warehouses, eq(items.warehouse_id, warehouses.warehouse_id))
            .groupBy(items.warehouse_id, warehouses.name)
            .orderBy(asc(warehouses.name))

        return NextResponse.json({
            status: 200,
            status_message: 'Items data retrieved and grouped by warehouse',
            data: groupedItems,
        });
    } catch (error) {
        console.error('Error retrieving items:', error);
        return NextResponse.json(
            {
                status: 500,
                status_message: 'Failed to retrieve items',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}