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
import { and, eq, inArray } from "drizzle-orm";
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
  products,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";
import {
  NewUserLog,
  user_logs,
} from "@/drizzle/schema/UserManagement/userLogs.schema";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const transferId = requestBody.transfer_id;

    const session = await validateBearerToken(req);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const trxTransfer = await db
      .select()
      .from(transfers)
      .where(eq(transfers.transfer_id, transferId));
    if (trxTransfer.length < 1) {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Transfer data not found",
          data: [],
        },
        { status: 404 }
      );
    }

    if (trxTransfer[0].destination_user_id !== null) {
      const recDate = trxTransfer[0].received_date || new Date();

      return NextResponse.json(
        {
          status: 404,
          status_message: `Transfer has been received at ${
            recDate.toISOString().replace("T", " ").split(".")[0]
          }`,
          data: [],
        },
        { status: 404 }
      );
    }

    const transferDetails = await db
      .select({
        item_id: transfer_details.item_id,
        product_id: transfer_details.product_id,
      })
      .from(transfer_details)
      .where(eq(transfer_details.transfer_id, transferId));

    const details = transferDetails.map((item) => ({
      item_id: item.item_id.split(","),
      product_id: item.product_id,
    }));

    let undetDetails = [];
    let itemLogCat: { item_id: string; is_missing: boolean }[] = [];
    for (const dataDetail of requestBody.details) {
      const arr1 = dataDetail.item_id;
      const filtered =
        details.find((i) => i.product_id == dataDetail.product_id) || null;
      // console.info(arr1);
      // console.info(filtered);
      if (filtered !== null) {
        const undetList = filtered.item_id.filter(
          (x: string) => !arr1.includes(x)
        );

        filtered.item_id.forEach((s: string) => {
          itemLogCat.push({ item_id: s, is_missing: undetList.includes(s) });
        });

        console.info(undetList);
        undetDetails.push({
          product_id: dataDetail.product_id,
          item_id: undetList,
        });
      } else {
        undetDetails.push({
          product_id: dataDetail.product_id,
          item_id: arr1,
        });
      }
    }

    await db.transaction(async (trx) => {
      const transfer = trxTransfer[0];

      //update transfer
      await trx.update(transfers).set({
        received_date: new Date(),
        destination_user_id: user.id,
        receive_note: requestBody.receive_note,
      });

      // update transfer details
      undetDetails.forEach(async (v) => {
        await trx
          .update(transfer_details)
          .set({ item_id_missing: v.item_id.join(",") })
          .where(
            and(
              eq(transfer_details.transfer_id, transfer.transfer_id),
              eq(transfer_details.product_id, v.product_id)
            )
          );
      });

      const orgiginWarehouse = await trx
        .select()
        .from(warehouses)
        .where(eq(warehouses.warehouse_id, transfer.origin_id));
      const itemLogs: NewItemLogs[] = [];
      itemLogCat.forEach((v: { item_id: string; is_missing: boolean }) => {
        const logMsg = v.is_missing
          ? `Not detected when receiving transfer [${
              transfer.transfer_id
            }] from ${orgiginWarehouse[0].name || "#N/A"}`
          : `Transfer has been received from ${
              orgiginWarehouse[0].name || "#N/A"
            }`;
        const newItemLog: NewItemLogs = {
          item_id: v.item_id,
          note: logMsg,
          ref: transfer.transfer_id,
          activity: "transfer",
          user_id: user.id,
        };
        itemLogs.push(newItemLog);
      });

      //Update Logs
      const newUserLog: NewUserLog = {
        user_log_id: uuidv4(),
        device: requestBody.device,
        version: requestBody.app_version,
        activity: "transfer",
        user_id: user.id,
        ref: transferId,
        note: `Transfer has been received from ${
          orgiginWarehouse[0].name || "#N/A"
        }`,
      };

      await trx.insert(item_logs).values(itemLogs);
      await trx.insert(user_logs).values(newUserLog);
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Transfer received successfully",
        data: [],
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
