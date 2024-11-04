import { db } from '@/drizzle/drizzle';
import { items } from '@/drizzle/schema/MasterData/masterData.schema';
import { asc, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request : NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const offset = (page - 1) * perPage;
    const allItems = await db.select().from(items).orderBy(asc(items.item_id)).offset(offset).limit(perPage);
    const totalCountResult = await db.select({ count: sql<number>`count(*)`.as('count') }).from(items);                      
    const totalCount = Number(totalCountResult[0].count);
    return NextResponse.json({
      status: 200,
      status_message: 'Items data retrieved',
      data: allItems,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      },
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