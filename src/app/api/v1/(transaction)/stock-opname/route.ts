import { db } from "@/drizzle/drizzle";
import {
  StockOpnameDetail,
  stock_opname_details,
} from "@/drizzle/schema/Transaction/stockOpnameDetails.schema";
import {
  NewStockOpname,
  StockOpname,
  stock_opnames,
} from "@/drizzle/schema/Transaction/stockOpnames.schema";
import { NewUserLog } from "@/drizzle/schema/UserManagement/userLogs.schema";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { createID } from "@/lib/utils/CreateIds";
import { createUserLog } from "@/lib/utils/LogUtils";
import { ReqBodyValidators } from "@/validation/ReqBodyValidators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allItems = await db.select().from(stock_opnames);
    return NextResponse.json({
      status: 200,
      status_message: "Stock Opname data retrieved",
      data: allItems,
    });
  } catch (error: any) {
    console.error("Error retrieving stock opname:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve stock opname data",
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

    const errors = ReqBodyValidators.StockOpnameValidator(
      requestBody as StockOpname
    );
    if (errors.length > 0) {
      // process the user's data
      return NextResponse.json(
        {
          status: 400,
          status_message: errors,
          data: null,
        },
        { status: 400 }
      );
    }

    if (requestBody.detail == 0 || requestBody.detail == null) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Stock opname detail can`t be empty",
          data: null,
        },
        { status: 400 }
      );
    }

    const soId = await createID("SOP", "stock_opnames", "stock_opname_id");

    let newSo: NewStockOpname = {
      stock_opname_id: soId,
      stock_opname_date: requestBody.stock_opname_date || new Date(),
      stock_opname_profile_id: requestBody.stock_opname_profile_id,
      location_id: requestBody.location_id,
      scan_type: requestBody.scan_type,
      user_id: user.id,
    };

    if (requestBody.detail == null) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Stock opname detail must be an array",
          data: null,
        },
        { status: 400 }
      );
    }

    await db.transaction(async (trx) => {
      await trx.insert(stock_opnames).values(newSo);

      let soDetailList = [];
      for (let i = 0; i < requestBody.detail.length; i++) {
        const product = requestBody.detail[i];
        if (product.product_id == null || product.item_id == null) {
          return NextResponse.json(
            {
              status: 400,
              status_message: "Stock opname detail format invalid",
              data: null,
            },
            { status: 400 }
          );
        }

        const newSoDetail: StockOpnameDetail = {
          stock_opname_id: soId,
          stock_opname_detail_id: `${soId}-${product.product_id}`,
          product_id: product.product_id,
          item_id: product.item_id,
        };

        soDetailList.push(newSoDetail);
        await trx.insert(stock_opname_details).values(newSoDetail);

        //create user log
        const userLog = await createUserLog({
          device: requestBody.device || "",
          version: requestBody.app_version || "",
          activity: "stock-opname",
          user_id: user.id,
          ref: soId,
          note: `create new stock opname transaction`,
        });
      }
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Stock opname created successfully",
        data: newSo,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating stock opname:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create Stock opname",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
