import { db } from '@/drizzle/drizzle';
import { items } from '@/drizzle/schema/MasterData/masterData.schema';
import { eq, inArray } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const requestData = await request.json();
  const qrArray: string[] = requestData.qr;

  try {
    const allItems = await db
      .select()
      .from(items)
      .where(inArray(items.qr, qrArray));

    return NextResponse.json({
      status: 200,
      status_message: 'Items data retrieved',
      data: allItems,
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