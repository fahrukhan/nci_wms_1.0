import { db } from "@/drizzle/drizzle";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import {
  StockOpnameDetail,
  stock_opname_details,
} from "@/drizzle/schema/Transaction/stockOpnameDetails.schema";
import {
  NewStockOpname,
  StockOpname,
  stock_opnames,
} from "@/drizzle/schema/Transaction/stockOpnames.schema";
import { users } from "@/drizzle/schema/UserManagement/users.schema";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { createID } from "@/lib/utils/CreateIds";
import { ReqBodyValidators } from "@/validation/ReqBodyValidators";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function buildMap(obj: any) {
  let map = new Map();
  Object.keys(obj).forEach((key) => {
    map.set(key, obj[key]);
  });
  return map;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const session = await validateBearerToken(req);
  if (!session) {
    return createUnauthorizedResponse("Missing or invalid bearer token");
  }

  const user = await getUserFromSession(session);
  if (!user) {
    return createUnauthorizedResponse("User not found");
  }

  console.log("id", id);

  try {
    const so = await db
      .select({
        stock_opname_id: stock_opnames.stock_opname_id,
        stock_opname_date: stock_opnames.stock_opname_date,
        location_id: stock_opnames.location_id,
        location_name: locations.name,
        location_path_name: locations.pathName,
        scan_type: stock_opnames.scan_type,
        user_id: stock_opnames.user_id,
        user_name: users.username || "",
        created_at: stock_opnames.created_at,
      })
      .from(stock_opnames)
      .leftJoin(users, eq(users.id, stock_opnames.user_id))
      .leftJoin(locations, eq(locations.location_id, stock_opnames.location_id))
      .where(eq(stock_opnames.stock_opname_id, id));

    console.log(so);

    const detail = await db
      .select({
        product_id: stock_opname_details.product_id,
        item_id: stock_opname_details.item_id,
        product_name: products.name,
      })
      .from(stock_opname_details)
      .leftJoin(
        products,
        eq(products.product_id, stock_opname_details.product_id)
      )
      .where(eq(stock_opname_details.stock_opname_id, id));

    const soDetails = detail.map((item) => ({
      product_name: item.product_name,
      qty: item.item_id.split(",").length,
    }));

    const data = {
      stock_opname_id: so[0].stock_opname_id,
      stock_opname_date: so[0].stock_opname_date,
      location_id: so[0].location_id,
      location_name: so[0].location_name,
      location_path_name: so[0].location_path_name,
      scan_type: so[0].scan_type,
      user_id: so[0].user_id,
      user_name: so[0].user_name,
      created_at: so[0].created_at,
      detail: soDetails,
    };

    return NextResponse.json({
      status: 200,
      status_message: "Stock opname data by profile retrieved",
      data: data,
    });
  } catch (error) {
    console.error("Error retrieving stock opname data by profile:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to retrieve stock opname data by profile",
        data: {},
      },
      { status: 500 }
    );
  }
}
