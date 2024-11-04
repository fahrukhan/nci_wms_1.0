import { getDefaultLocation } from "@/lib/utils/GetDefaultLocation";
import { db } from "@/drizzle/drizzle";
import { NextRequest, NextResponse } from "next/server";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { createID } from "@/lib/utils/CreateIds";
import { v4 as uuidv4 } from "uuid";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  relocations,
  relocation_details,
  NewRelocation,
  NewRelocationDetail,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  item_logs,
  items,
  locations,
  NewItemLogs,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import {
  NewUserLog,
  user_logs,
} from "@/drizzle/schema/UserManagement/userLogs.schema";

function padLeft(num: number, size: number): string {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const originId = searchParams.get("originId");
    const destinationId = searchParams.get("destinationId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");

    const offset = (page - 1) * perPage;

    const whereConditions = and(
      startDate
        ? gte(relocations.relocation_date, new Date(startDate))
        : undefined,
      endDate ? lte(relocations.relocation_date, new Date(endDate)) : undefined,
      originId ? eq(relocations.origin_id, parseInt(originId)) : undefined,
      destinationId
        ? eq(relocations.destination_id, parseInt(destinationId))
        : undefined
    );

    const originLocation = alias(locations, "originLocation");
    const destinationLocation = alias(locations, "destinationLocation");

    const allItems = await db
      .select({
        relocation_id: relocations.relocation_id,
        relocation_date: relocations.relocation_date,
        ref: relocations.ref,
        note: relocations.note,
        destination_name: destinationLocation.name,
        origin_name: originLocation.name,
      })
      .from(relocations)
      .where(whereConditions)
      .leftJoin(
        originLocation,
        eq(originLocation.location_id, relocations.origin_id)
      )
      .leftJoin(
        destinationLocation,
        eq(destinationLocation.location_id, relocations.destination_id)
      )
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(relocations)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "relocation data retrieved",
      data: allItems,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving relocation data:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve relocation data",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody: RelocationRequestDTO = await req.json();

    const session = await validateBearerToken(req);
    if (!session)
      return createUnauthorizedResponse("Missing or invalid bearer token");

    const user = await getUserFromSession(session);
    if (!user) return createUnauthorizedResponse("User not found");

    const relocationsData: NewRelocation[] = [];
    const relocationDetailsData: NewRelocationDetail[] = [];
    const itemLogs: NewItemLogs[] = [];
    const userLogs: NewUserLog[] = [];
    const itemIds: string[] = [];

    await db.transaction(async (trx) => {
      let index = 0;
      let relocationId = await createID("REL", "relocations", "relocation_id");
      const destination = await db
        .select()
        .from(locations)
        .where(eq(locations.location_id, requestBody.destination_id));
      const warehouse = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.warehouse_id, destination[0].warehouse_id));

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}${month}${day}`;

      let relocationPartId = relocationId;
      for (const dataItem of requestBody.data) {
        const padLength =
          requestBody.data.length.toString().length <= 1
            ? 2
            : requestBody.data.length.toString().length;

        if (index > 0) {
          const latestSequence = parseInt(relocationPartId.slice(-5));
          const sequenceNumber = latestSequence + 1;
          const paddedSequence = String(sequenceNumber).padStart(5, "0");
          relocationPartId = `REL${dateString}${paddedSequence}`;
        }

        relocationsData.push({
          relocation_id: relocationPartId,
          relocation_date: new Date(),
          origin_id: dataItem.origin_location_id,
          destination_id: requestBody.destination_id,
          ref: requestBody.ref ?? "",
          note: requestBody.note ?? "",
          scan_type: requestBody.scan_type,
          user_id: user.id,
        });

        for (const product of dataItem.products) {
          relocationDetailsData.push({
            relocation_detail_id: uuidv4(),
            relocation_id: relocationPartId,
            item_id: product.item_id.join(","), // Join item_ids into a single string
            product_id: product.product_id,
          });

          // populate item logs
          product.item_id.forEach((itemId) => {
            itemIds.push(itemId);
            const newItemLog: NewItemLogs = {
              item_id: itemId,
              note: `Relocated to ${destination[0].name || "#N/A"} in ${
                warehouse[0].name || "#N/A"
              }`,
              ref: relocationPartId,
              activity: "relocation",
              user_id: user.id,
            };
            itemLogs.push(newItemLog);
          });
        }

        //create user logs
        const sumItems = dataItem.products.reduce(
          (partialSum, p) => partialSum + p.item_id.length,
          0
        );
        const newUserLog: NewUserLog = {
          user_log_id: uuidv4(),
          device: requestBody.device,
          version: requestBody.app_version,
          activity: "relocation",
          user_id: user.id,
          ref: relocationPartId,
          note: `Relocated ${sumItems} item to ${
            destination[0].name || "#N/A"
          } in ${warehouse[0].name || "#N/A"}`,
        };
        userLogs.push(newUserLog);

        index++;
      }

      // Batch insert relocations
      await trx.insert(relocations).values(relocationsData);

      // Batch insert relocation details
      await trx.insert(relocation_details).values(relocationDetailsData);

      // Batch update items
      await trx
        .update(items)
        .set({
          in_stock: true,
          on_transfer: false,
          location_id: requestBody.destination_id,
        })
        .where(inArray(items.item_id, itemIds));

      // Create logs
      await trx.insert(item_logs).values(itemLogs);
      await trx.insert(user_logs).values(userLogs);
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Relocations created successfully",
        data: "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating relocation:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create relocation",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
