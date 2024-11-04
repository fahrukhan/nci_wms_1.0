import { db } from "@/drizzle/drizzle";
import { locations } from "@/drizzle/schema/MasterData/locations.schema";
import { stock_opnames } from "@/drizzle/schema/Transaction/stockOpnames.schema";
import { stock_opname_details } from "@/drizzle/schema/Transaction/stockOpnameDetails.schema";
import { users } from "@/drizzle/schema/UserManagement/users.schema";
import { createUnauthorizedResponse, getUserFromSession, validateBearerToken } from "@/lib/utils/AuthUtils";
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { profile_id: string }}) {
  const session = await validateBearerToken(req);
  if (!session) {
    return createUnauthorizedResponse('Missing or invalid bearer token');
  }

  const user = await getUserFromSession(session);
  if (!user) {
    return createUnauthorizedResponse('User not found');
  }

  try {
    const allSoByProfile = await db.execute(sql`
      SELECT 
        so.stock_opname_id,
        so.stock_opname_date,
        so.location_id,
        l.name as location_name,
        l.path_name as location_path_name,
        so.scan_type,
        so.user_id,
        u.username as user_name,
        so.created_at,
        COALESCE(item_count.quantity, 0) as quantity
      FROM ${stock_opnames} so
      LEFT JOIN ${locations} l ON l.location_id = so.location_id
      LEFT JOIN ${users} u ON u.id = so.user_id
      LEFT JOIN LATERAL (
        SELECT COUNT(DISTINCT unnest) as quantity
        FROM ${stock_opname_details} sod,
        LATERAL unnest(string_to_array(sod.item_id, ','))
        WHERE sod.stock_opname_id = so.stock_opname_id
      ) item_count ON true
      WHERE so.stock_opname_profile_id = ${params.profile_id}
    `);

    return NextResponse.json({
      status: 200,
      status_message: 'Stock opname data by profile retrieved',
      data: allSoByProfile,
    });
  } catch (error) {
    console.error('Error retrieving stock opname data by profile:', error);
    return NextResponse.json(
      {
        status: 500,
        status_message: 'Failed to retrieve stock opname data by profile',
        data: {},
      },
      { status: 500 }
    );
  }
}