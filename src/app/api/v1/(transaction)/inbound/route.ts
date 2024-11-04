import { db } from "@/drizzle/drizzle";
import { v4 as uuidv4 } from "uuid";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import {
  inbound_details,
  inbounds,
  NewInbound,
  NewInboundDetail,
} from "@/drizzle/schema/Transaction/transaction.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";
import {
  contacts,
  item_logs,
  items,
  NewItemLogs,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { createID } from "@/lib/utils/CreateIds";
import { getDefaultLocation } from "@/lib/utils/GetDefaultLocation";
import { createUserLog } from "@/lib/utils/LogUtils";

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
    const warehouseId = searchParams.get("warehouseId");
    const supplierId = searchParams.get("supplierId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");

    const offset = (page - 1) * perPage;

    const whereConditions = and(
      startDate ? gte(inbounds.inbound_date, new Date(startDate)) : undefined,
      endDate ? lte(inbounds.inbound_date, new Date(endDate)) : undefined,
      supplierId ? eq(inbounds.supplier_id, parseInt(supplierId)) : undefined,
      warehouseId ? eq(inbounds.warehouse_id, parseInt(warehouseId)) : undefined
    );

    const data = await db
      .select({
        inbound_id: inbounds.inbound_id,
        inbound_date: inbounds.inbound_date,
        supplier_name: contacts.name,
        admin_name: users.username,
        ref: inbounds.ref,
      })
      .from(inbounds)
      .where(whereConditions)
      .leftJoin(users, eq(inbounds.user_id, users.id))
      .leftJoin(contacts, eq(inbounds.supplier_id, contacts.contact_id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(inbounds.created_at));

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(inbounds)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Inbounds data retrieved",
      data: data,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving inbounds:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve inbounds",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const session = await validateBearerToken(req);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    // TODO: Implement role-based access control and warehouse assignment checks here

    const [supplier, warehouse, inboundId, { location_id: locationId }] =
      await Promise.all([
        db
          .select()
          .from(contacts)
          .where(eq(contacts.contact_id, requestBody.supplier_id))
          .limit(1),
        db
          .select()
          .from(warehouses)
          .where(eq(warehouses.warehouse_id, requestBody.warehouse_id))
          .limit(1),
        createID("INB", "inbounds", "inbound_id"),
        getDefaultLocation(requestBody.warehouse_id),
      ]);

    if (requestBody.details.length === 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input items for inbounds",
          data: "",
        },
        { status: 400 }
      );
    }

    const newInbound: NewInbound = {
      inbound_id: inboundId,
      inbound_date: new Date(requestBody.inbound_date ?? Date.now()),
      supplier_id: requestBody.supplier_id,
      ref: requestBody.ref,
      user_id: user.id,
      warehouse_id: requestBody.warehouse_id,
      location_id: locationId,
      note: requestBody.note,
      scan_type: requestBody.scan_type,
    };

    const result = await db.transaction(async (trx) => {
      await trx.insert(inbounds).values(newInbound);

      const inboundDetailList: NewInboundDetail[] = [];
      const itemLogs: NewItemLogs[] = [];
      const itemIds: string[] = [];
      const itemUpdates: Record<
        string,
        { in_stock: boolean; on_transfer: boolean }
      > = {};

      for (const detail of requestBody.details) {
        const newInboundDetail: NewInboundDetail = {
          inbound_id: inboundId,
          inbound_detail_id: uuidv4(),
          item_id: detail.item_id,
          product_id: detail.product_id,
        };
        inboundDetailList.push(newInboundDetail);

        for (const itemId of detail.item_id) {
          itemIds.push(itemId);

          const newItemLog: NewItemLogs = {
            item_id: itemId,
            note: `Inbound from ${supplier[0]?.name || "#N/A"} in ${
              warehouse[0]?.name || "#N/A"
            }`,
            ref: inboundId,
            activity: "inbound",
            user_id: user.id,
          };
          itemLogs.push(newItemLog);

          // Determine new status (implement your logic here)
          const newStatus = { in_stock: true, on_transfer: false };
          itemUpdates[itemId] = newStatus;
        }
      }

      await Promise.all([
        trx.insert(inbound_details).values(inboundDetailList),
        trx.insert(item_logs).values(itemLogs),
        ...Object.entries(itemUpdates).map(([itemId, status]) =>
          trx.update(items).set(status).where(eq(items.item_id, itemId))
        ),
      ]);

      await createUserLog({
        device: requestBody.device,
        version: requestBody.app_version,
        activity: "inbound",
        user_id: user.id,
        ref: inboundId,
        note: `Inbound ${itemIds.length} item(s) from ${
          supplier[0]?.name || "#N/A"
        } in ${warehouse[0]?.name || "#N/A"}`,
      });

      return { inboundId, inboundDate: newInbound.inbound_date };
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Inbound created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating inbound:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create inbound",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
