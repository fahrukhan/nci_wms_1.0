import { db } from "@/drizzle/drizzle";
import {
  NewStockOpnameProfile,
  StockOpnameProfile,
  stock_opname_profiles,
} from "@/drizzle/schema/Transaction/stockOpnameProfiles.schema";
import { stock_opnames } from "@/drizzle/schema/Transaction/transaction.schema";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { createID } from "@/lib/utils/CreateIds";
import { createUserLog } from "@/lib/utils/LogUtils";
import { ReqBodyValidators } from "@/validation/ReqBodyValidators";
import { sql, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await validateBearerToken(req);
  if (!session) {
    return createUnauthorizedResponse("Missing or invalid bearer token");
  }

  const user = await getUserFromSession(session);
  if (!user) {
    return createUnauthorizedResponse("User not found");
  }

  try {
    const allSoProfilesWithCount = await db
      .select({
        stock_opname_profile_id: stock_opname_profiles.stock_opname_profile_id,
        title: stock_opname_profiles.title,
        description: stock_opname_profiles.description,
        activity: sql<number>`count(${stock_opnames.stock_opname_id})::int`,
      })
      .from(stock_opname_profiles)
      .leftJoin(
        stock_opnames,
        eq(
          stock_opname_profiles.stock_opname_profile_id,
          stock_opnames.stock_opname_profile_id
        )
      )
      .groupBy(
        stock_opname_profiles.stock_opname_profile_id,
        stock_opname_profiles.title,
        stock_opname_profiles.description
      );

    return NextResponse.json({
      status: 200,
      status_message: "Stock opname profiles data retrieved with counts",
      data: allSoProfilesWithCount,
    });
  } catch (error) {
    console.error("Error retrieving stock opname profiles:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve stock opname profiles",
        data: {},
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

    const errors = ReqBodyValidators.StockOpnameProfileValidator(
      requestBody as StockOpnameProfile
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

    const soProfId = await createID(
      "SPR",
      "stock_opname_profiles",
      "stock_opname_profile_id"
    );

    let newProfile: NewStockOpnameProfile = {
      stock_opname_profile_id: soProfId,
      title: requestBody.title,
      description: requestBody.description,
      warehouse_id: requestBody.warehouse_id,
      user_id: user.id,
    };

    await db.insert(stock_opname_profiles).values(newProfile);

    const userLog = await createUserLog({
      device: requestBody.device || "",
      version: requestBody.app_version || "",
      activity: "stock-opname",
      user_id: user.id,
      ref: soProfId,
      note: `create new stock opname profile`,
    });

    return NextResponse.json(
      {
        status: 201,
        status_message: "Stock opname profile created successfully",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating stock opname profile:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to create Stock opname profile",
        data: error ?? "",
      },
      { status: 500 }
    );
  }
}
