import { db } from "@/drizzle/drizzle";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createID } from "@/lib/utils/CreateIds";
import { NextRequest, NextResponse } from "next/server";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { getDefaultLocation } from "@/lib/utils/GetDefaultLocation";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import {
  NewOutbound,
  NewOutboundDetail,
  outbound_details,
  outbounds,
} from "@/drizzle/schema/Transaction/transaction.schema";
import { contacts } from "@/drizzle/schema/MasterData/masterData.schema";
import { users } from "@/drizzle/schema/UserManagement/userManagement.schema";

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
    const contactId = searchParams.get("contactId");
    const warehouseId = searchParams.get("warehouseId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");

    const offset = (page - 1) * perPage;

    const whereConditions = and(
      startDate ? gte(outbounds.created_at, new Date(startDate)) : undefined,
      endDate ? lte(outbounds.created_at, new Date(endDate)) : undefined,
      contactId ? eq(outbounds.customer_id, parseInt(contactId)) : undefined,
      warehouseId
        ? eq(outbounds.warehouse_id, parseInt(warehouseId))
        : undefined
    );

    const data = await db
      .select({
        outbound_id: outbounds.outbound_id,
        outbound_date: outbounds.outbound_date,
        customer_name: contacts.name,
        admin_name: users.username,
        ref: outbounds.ref,
      })
      .from(outbounds)
      .where(whereConditions)
      .leftJoin(users, eq(outbounds.user_id, users.id))
      .leftJoin(contacts, eq(outbounds.customer_id, contacts.contact_id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(outbounds.created_at));

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(outbounds)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0].count);

    if (data.length === 0) {
      return NextResponse.json({
        status: 200,
        status_message: "There is no outbounds data yet",
        data: [],
        pagination: {
          currentPage: page,
          perPage: perPage,
          totalItems: 0,
          totalPages: 0,
        },
      });
    }

    return NextResponse.json({
      status: 200,
      status_message: "Outbounds data retrieved",
      data: data,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving outbounds:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve outbounds",
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

    const outboundId = await createID("OUT", "outbounds", "outbound_id");
    const { location_id: locationId } = await getDefaultLocation(
      requestBody.warehouse_id
    );

    let newOutbound: NewOutbound = {
      outbound_id: outboundId,
      outbound_date: new Date(requestBody.outbound_date ?? Date.now()),
      customer_id: requestBody.customer_id,
      ref: requestBody.ref,
      user_id: user.id,
      warehouse_id: requestBody.warehouse_id,
      location_id: locationId,
      note: requestBody.note,
      scan_type: requestBody.scan_type,
    };

    if (requestBody.details.length == 0) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input items for outbounds",
          data: "",
        },
        { status: 400 }
      );
    }

    await db.transaction(async (trx) => {
      await trx.insert(outbounds).values(newOutbound);

      for (const detail of requestBody.details) {
        const newOutboundDetail: NewOutboundDetail = {
          outbound_id: outboundId,
          outbound_detail_id: uuidv4(),
          item_id: detail.item_id,
          product_id: detail.product_id,
        };

        await trx.insert(outbound_details).values(newOutboundDetail);

        if (Array.isArray(detail.item_id)) {
          for (const itemId of detail.item_id) {
            await trx.delete(items).where(eq(items.item_id, itemId));
          }
        } else {
          await trx.delete(items).where(eq(items.item_id, detail.item_id));
        }
      }
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Outbound created successfully",
        data: {
          outbound_id: outboundId,
          outbound_date: newOutbound.outbound_date,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating outbound:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create outbound",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
