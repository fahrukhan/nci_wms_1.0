import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq, sql } from 'drizzle-orm';
import { Attribute, attributes, categories, products, units } from '@/drizzle/schema/MasterData/masterData.schema';
import { PgSerial, PgTableWithColumns, alias } from 'drizzle-orm/pg-core';

// Get detail of a unit
export async function GET(request: NextRequest, {params} : {params : {id : string}}) {
    try {

      //aliasing
      const unitBase = alias(units,"unitBase");
      const unitSub = alias(units,"unitSub");
      const attribute1 = alias(attributes,"attribute1");
      const attribute2 = alias(attributes,"attribute2");
      const attribute3 = alias(attributes,"attribute3");
  
      const unitDetail = await db
        .select({
          product_id: products.product_id,
          name: products.name,
          image:products.image,
          category: categories,
          attribute1: attribute1,
          attribute2: attribute2,
          attribute3: attribute3,
          qty_min: products.qty_min,
          qty_max: products.qty_max,
          unit_base: unitBase,
          unit_sub: unitSub,
          convertion_factor: products.convertion_factor
        })
        .from(products)
        .where(eq(products.product_id, Number(params.id)))
        .fullJoin(attribute1, eq(products.attribute1_id, attribute1.attribute_id))
        .fullJoin(attribute2, eq(products.attribute2_id, attribute2.attribute_id))
        .fullJoin(attribute3, eq(products.attribute3_id, attribute3.attribute_id))
        .fullJoin(categories, eq(products.category_id, categories.category_id))
        .fullJoin(unitBase, eq(products.unit_base_id, unitBase.unit_id))
        .fullJoin(unitSub, eq(products.unit_sub_id, unitSub.unit_id))
        .limit(1);

  
      if (unitDetail.length === 0) {
        return NextResponse.json({ error: 'Product detail not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        status_message: "Product detail retrieved",
        data: unitDetail[0],
      });
      
    } catch (error) {
      console.error('Error retrieving product detail:', error);
      return NextResponse.json({ error: 'Failed to retrieve Product detail' }, { status: 500 });
    }
}
