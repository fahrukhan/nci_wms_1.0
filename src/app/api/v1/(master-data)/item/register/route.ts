import { getCurrentDateFormatted } from "@/lib/utils/GetCurrentDateFormatted";
import { db } from "@/drizzle/drizzle";
import {
  item_logs,
  items,
  NewItem,
  products,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { NextResponse } from "next/server";
import { getDefaultLocation } from "@/lib/utils/GetDefaultLocation";
import { createItemLog, createUserLog } from "@/lib/utils/LogUtils";
import { eq, inArray } from "drizzle-orm";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";

export async function GET() {
  try {
    const allItems = await db.select().from(items);
    return NextResponse.json({
      status: 200,
      status_message: "Items data retrieved",
      data: allItems,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve items",
        data: {},
      },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
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

    const identities =
      requestBody.type == "rfid" ? requestBody.rfid : requestBody.qr;
    const ginFormat = `GIN${getCurrentDateFormatted()}`;
    const currentLocation = await getDefaultLocation(requestBody.warehouse_id);

    // Check for existing RFIDs/QRs
    const existingItems = await db
      .select({ identity: requestBody.type == "rfid" ? items.rfid : items.qr })
      .from(items)
      .where(
        inArray(requestBody.type == "rfid" ? items.rfid : items.qr, identities)
      );

    const existingIdentities = new Set(
      existingItems.map((item) => item.identity)
    );

    const failedRegistrations = identities.filter((identity: any) =>
      existingIdentities.has(identity)
    );
    const validIdentities = identities.filter(
      (identity: any) => !existingIdentities.has(identity)
    );

    const result = await db.transaction(async (trx) => {
      let newItemData = [];
      let itemLogs: ItemLogDTO[] = [];

      await createUserLog({
        device: requestBody.device,
        version: requestBody.app_version,
        activity: "tag-register",
        user_id: user.id,
        ref: new Date(Date.now()).toDateString(),
        note: `Attempted ${identities.length} tag registrations, ${validIdentities.length} successful`,
      });

      for (const identity of validIdentities) {
        await new Promise((f) => setTimeout(f, 1));
        let date = new Date(Date.now());
        let milliseconds = date.getTime();

        const newItem: NewItem = {
          item_id: `REG${milliseconds}${(Math.random() + 1)
            .toString(36)
            .substring(7)
            .toUpperCase()}`,
          rfid: requestBody.type == "rfid" ? identity : "",
          qr: requestBody.type == "qr" ? identity : "",
          in_stock: false,
          gin: ginFormat,
          on_transfer: false,
          attribute1_value: requestBody.attribute1_value || "",
          attribute2_value: requestBody.attribute2_value || "",
          attribute3_value: requestBody.attribute3_value || "",
          product_id: requestBody.product_id,
          location_id: currentLocation.location_id,
          warehouse_id: requestBody.warehouse_id,
          supplier_id: 0,
          has_expired_date: requestBody.has_expired_date,
          expired_date: requestBody.expired_date
            ? new Date(requestBody.expired_date)
            : null,
        };

        newItemData.push(newItem);

        const product = await db
          .select({ name: products.name })
          .from(products)
          .where(eq(products.product_id, requestBody.product_id));
        const newItemLog: ItemLogDTO = {
          item_id: newItem.item_id,
          note: `Tag ${identity} registered as ${product[0].name}`,
          ref: new Date(Date.now()).toDateString(),
          activity: "tag-register",
          user_id: user.id,
        };
        itemLogs.push(newItemLog);
      }

      if (newItemData.length > 0) {
        await trx.insert(items).values(newItemData);
        await trx.insert(item_logs).values(itemLogs);
      }

      return {
        successfulRegistrations: validIdentities.length,
        failedRegistrations: failedRegistrations,
      };
    });

    return NextResponse.json(
      {
        status: 200,
        status_message: "Item registration process completed",
        data: {
          successful_registrations: result.successfulRegistrations,
          failed_registrations: result.failedRegistrations,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error registering items:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to register items",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
