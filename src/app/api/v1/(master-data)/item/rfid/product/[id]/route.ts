import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq } from 'drizzle-orm';
import { attributes, categories, items, products, units } from '@/drizzle/schema/MasterData/masterData.schema';
import { alias } from 'drizzle-orm/pg-core';

// Get detail of a unit
export async function GET(request: NextRequest, {params} : {params : {id : string}}) {
    try {

        //aliasing
        const unitBase = alias(units,"unitBase");
        const unitSub = alias(units,"unitSub");
        const attribute1 = alias(attributes,"attribute1");
        const attribute2 = alias(attributes,"attribute2");
        const attribute3 = alias(attributes,"attribute3");
        
        const product = await db
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
        
        if(product.length < 1) return  NextResponse.json({
            status: 400,
            status_message: "Product not found!",
        }, { status: 500 });

        const item = await db.select({
                rfid: items.rfid
            })
            .from(items)
            .where(eq(items.product_id, Number(params.id)));
        
        const rfids = item.map(a => a.rfid);
        
        const data = {
            product_id: product[0].product_id,
            name: product[0].name,
            image: product[0].image,
            category: product[0].category,
            attribute1: product[0].attribute1,
            attribute2: product[0].attribute2,
            attribute3: product[0].attribute3,
            qty_min: product[0].qty_min,
            qty_max: product[0].qty_max,
            unit_base: product[0].unit_base,
            unit_sub: product[0].unit_sub,
            convertion_factor: product[0].convertion_factor,
            rfid: rfids
        };
  
        return NextResponse.json({
            status: 200,
            status_message: "Product detail retrieved",
            data:data,
        });
      
    } catch (error) {
      console.error('Error retrieving product detail:', error);
      return NextResponse.json({ error: 'Failed to retrieve Product detail' }, { status: 500 });
    }
}
