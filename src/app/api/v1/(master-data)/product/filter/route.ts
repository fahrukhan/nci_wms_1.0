
import { db } from '@/drizzle/drizzle';
import { NewProduct, products } from '@/drizzle/schema/MasterData/masterData.schema';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const key = await req.nextUrl.searchParams.get("key");
    switch(key) {
      case "name": {
        const productName = await db.select({
          product_id: products.product_id,
          name: products.name,
        }).from(products);
        return NextResponse.json({
          status: 200,
          status_message: 'Products filter by name',
          data: productName,
        });
      }
      default: {
        const allProducts = await db.select().from(products);
        return NextResponse.json({
          status: 200,
          status_message: 'Products',
          data: allProducts,
        });
      }
    }
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json(
      {
        status: 500,
        status_message: 'Failed to retrieve products',
        data: error,
      },
      { status: 500 }
    );
  }
}
