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
import { and, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  NewTransfer,
  NewTransferDetail,
  transfer_details,
  transfers,
} from "@/drizzle/schema/Transaction/transaction.schema";
import {
  item_logs,
  items,
  NewItemLogs,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import {
  NewUserLog,
  user_logs,
} from "@/drizzle/schema/UserManagement/userLogs.schema";

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
    const warehouseId = searchParams.get("warehouseId");

    const destinationId = searchParams.get("destinationId");
    //const limit = parseInt(searchParams.get('limit') || '100'); // blm diperlukan
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "10");

    const offset = (page - 1) * perPage;

    // const whereConditions = and(
    //   startDate ? gte(transfers.transfer_date, new Date(startDate)) : undefined,
    //   endDate ? lte(transfers.transfer_date, new Date(endDate)) : undefined,
    //   originId ? eq(transfers.origin_id, parseInt(originId)) : undefined,
    //   destinationId ? eq(transfers.destination_id, parseInt(destinationId)) : undefined
    // );

    const originWarehouse = alias(warehouses, "originWarehouse");
    const destinationWarehouse = alias(warehouses, "destinationWarehouse");
    const activeWarehouse = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.warehouse_id, parseInt(warehouseId || "0")));

    const whereConditions2 =
      activeWarehouse.length < 1
        ? and(
            startDate
              ? gte(transfers.transfer_date, new Date(`${startDate}T00:00:00`))
              : undefined,
            endDate
              ? lte(transfers.transfer_date, new Date(`${endDate}T23:59:59`))
              : undefined,
            originId ? eq(transfers.origin_id, parseInt(originId)) : undefined,
            destinationId
              ? eq(transfers.destination_id, parseInt(destinationId))
              : undefined
          )
        : and(
            startDate
              ? gte(transfers.transfer_date, new Date(`${startDate}T00:00:00`))
              : undefined,
            endDate
              ? lte(transfers.transfer_date, new Date(`${endDate}T23:59:59`))
              : undefined,
            or(
              warehouseId
                ? eq(transfers.origin_id, parseInt(warehouseId))
                : undefined,
              warehouseId
                ? eq(transfers.destination_id, parseInt(warehouseId))
                : undefined
            )
          );

    const allItems = await db
      .select({
        transfer_id: transfers.transfer_id,
        transfer_date: transfers.transfer_date,
        received_date: transfers.received_date,
        destination_user_id: transfers.destination_user_id,
        ref: transfers.ref,
        note: transfers.note,
        destination_warehouse: destinationWarehouse.name,
        origin_warehouse: originWarehouse.name,
        transfer_status: sql<string>`'pending'`,
        transfer_type: sql<string>`'out'`,
      })
      .from(transfers)
      .where(whereConditions2)
      .leftJoin(
        originWarehouse,
        eq(originWarehouse.warehouse_id, transfers.origin_id)
      )
      .leftJoin(
        destinationWarehouse,
        eq(destinationWarehouse.warehouse_id, transfers.destination_id)
      )
      .orderBy(desc(transfers.transfer_date))
      .limit(perPage)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as("count") })
      .from(transfers)
      .where(whereConditions2);

    //update transfer status
    allItems.forEach((a) => {
      if (a.destination_user_id != null) {
        a.transfer_status = "complete";
      }
      if (activeWarehouse.length > 0) {
        a.transfer_type =
          activeWarehouse[0].name == a.destination_warehouse ? "in" : "out";
      }
    });

    const pendingTransfer = allItems.filter(
      (a) => a.transfer_status == "pending"
    );
    pendingTransfer.sort((a, b) =>
      a.transfer_date > b.transfer_date ? -1 : 1
    );

    const completeTransfer = allItems.filter(
      (a) => a.transfer_status != "pending"
    );
    completeTransfer.sort((a, b) =>
      a.transfer_date > b.transfer_date ? -1 : 1
    );

    completeTransfer.forEach((c) => pendingTransfer.push(c));

    const totalCount = Number(totalCountResult[0].count);

    return NextResponse.json({
      status: 200,
      status_message: "Transfer data retrieved",
      data: pendingTransfer,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving transfer data:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve transfer data",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const needReceivement = requestBody.need_receivement || false;

    const session = await validateBearerToken(req);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const transferId = await createID("TRF", "transfers", "transfer_id");
    const destination = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.warehouse_id, requestBody.destination_id));
    const newLocation = await getDefaultLocation(requestBody.destination_id);

    let newTransfer: NewTransfer = {
      transfer_id: transferId,
      transfer_date: new Date(requestBody.transfer_date),
      received_date: needReceivement ? null : new Date(),
      origin_id: requestBody.origin_id,
      destination_id: requestBody.destination_id,
      origin_user_id: user.id,
      destination_user_id: needReceivement ? null : user.id,
      ref: requestBody.ref,
      note: requestBody.note,
      scan_type: requestBody.scan_type,
    };

    let transferDetails: NewTransferDetail[] = [];

    await db.transaction(async (trx) => {
      const itemIds: string[] = [];
      const itemLogs: NewItemLogs[] = [];

      await trx.insert(transfers).values(newTransfer);

      for (let i = 0; i < requestBody.details.length; i++) {
        let newTransferDetail: NewTransferDetail = {
          transfer_detail_id: uuidv4(),
          transfer_id: transferId,
          item_id: requestBody.details[i].item_id,
          product_id: requestBody.details[i].product_id,
        };
        transferDetails.push(newTransferDetail);

        const itemLogMsg = needReceivement
          ? `Transfered to ${
              destination[0].name || "#N/A"
            } with receivement flag`
          : `Transfered to ${destination[0].name || "#N/A"}`;
        requestBody.details[i].item_id.forEach((itemId: string) => {
          itemIds.push(itemId);
          const newItemLog: NewItemLogs = {
            item_id: itemId,
            note: itemLogMsg,
            ref: transferId,
            activity: "transfer",
            user_id: user.id,
          };
          itemLogs.push(newItemLog);
        });
      }

      // create transfer detail
      await trx.insert(transfer_details).values(transferDetails);

      // Batch update items
      await trx
        .update(items)
        .set({
          in_stock: !needReceivement,
          on_transfer: needReceivement,
          warehouse_id: requestBody.destination_id,
          location_id: newLocation.location_id,
        })
        .where(inArray(items.item_id, itemIds));

      //Update Logs
      const newUserLog: NewUserLog = {
        user_log_id: uuidv4(),
        device: requestBody.device,
        version: requestBody.app_version,
        activity: "transfer",
        user_id: user.id,
        ref: transferId,
        note: `Transfer ${itemLogs.length} item to ${
          destination[0].name || "#N/A"
        }`,
      };
      await trx.insert(item_logs).values(itemLogs);
      await trx.insert(user_logs).values(newUserLog);
    });

    const data = {
      ...newTransfer,
      detail: transferDetails,
    };

    return NextResponse.json(
      {
        status: 201,
        status_message: "Transfer created successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create transfer",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
