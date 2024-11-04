import { db } from '@/drizzle/drizzle';
import { stock_opname_profiles } from '@/drizzle/schema/Transaction/stockOpnameProfiles.schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { warehouse_id: string }}) {
  // const session = await validateBearerToken(req);
  //   if (!session) {
  //       return createUnauthorizedResponse('Missing or invalid bearer token');
  //   }

  //   const user  = await getUserFromSession(session);
  //   if (!user) {
  //     return createUnauthorizedResponse('User not found');
  //   }

  try {
    const allSoProfiles = await db.select({
      stock_opname_profile_id: stock_opname_profiles.stock_opname_profile_id,
      title: stock_opname_profiles.title,
      description: stock_opname_profiles.description,
      created_at: stock_opname_profiles.created_at
    }).from(stock_opname_profiles).where(eq(stock_opname_profiles.warehouse_id, Number(params.warehouse_id)));

    return NextResponse.json({
      status: 200,
      status_message: 'Items data retrieved',
      data: allSoProfiles,
    });

  } catch (error) {
    console.error('Error retrieving items:', error);
    return NextResponse.json(
      {
        status: 500,
        status_message: 'Failed to retrieve items',
        data: {},
      },
      { status: 500 }
    );
  }
}