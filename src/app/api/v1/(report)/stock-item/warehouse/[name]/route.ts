import { db } from "@/drizzle/drizzle";
import { items } from "@/drizzle/schema/MasterData/items.schema";
import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, sql } from "drizzle-orm";
import { products } from "@/drizzle/schema/MasterData/products.schema";
import { warehouses } from "@/drizzle/schema/MasterData/masterData.schema";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productName = searchParams.get('productName');
        const currentWarehouse = decodeURIComponent(params.name);
        let groupedItems;
        let totalQty;
        let warehouseName;

        const baseWhereCondition = eq(warehouses.name, currentWarehouse);

        if (productName) {
            groupedItems = await db
                .select({
                    warehouse_name: warehouses.name,
                    products_id: products.product_id,
                    products_name: products.name,
                    count: sql<number>`cast(count(${items.item_id}) as integer)`,
                })
                .from(items)
                .where(and(baseWhereCondition, eq(products.name, productName)))
                .innerJoin(products, eq(items.product_id, products.product_id))
                .innerJoin(warehouses, eq(items.warehouse_id, warehouses.warehouse_id))
                .groupBy(products.product_id, products.name, warehouses.name)
                .orderBy(asc(products.name));

        } else {

            groupedItems = await db
                .select({
                    warehouse_name: warehouses.name,
                    products_id: products.product_id,
                    products_name: products.name,
                    count: sql<number>`cast(count(${items.item_id}) as integer)`,
                })
                .from(items)
                .where(baseWhereCondition)
                .innerJoin(products, eq(items.product_id, products.product_id))
                .innerJoin(warehouses, eq(items.warehouse_id, warehouses.warehouse_id))
                .groupBy(products.product_id, products.name, warehouses.name)
                .orderBy(asc(products.name));
        }

        totalQty = groupedItems.reduce((sum, item) => sum + item.count, 0);
        warehouseName = groupedItems[0]?.warehouse_name || '';

        return NextResponse.json({
            status: 200,
            status_message: 'Items data retrieved and grouped by warehouse',
            data: {
                items: groupedItems.map(({ warehouse_name, ...rest }) => rest),
                totalQty: totalQty,
                warehouseName: warehouseName,
            },
        });
    } catch (error) {
        console.error('Error retrieving items:', error);
        return NextResponse.json(
            {
                status: 500,
                status_message: 'Failed to retrieve items',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}