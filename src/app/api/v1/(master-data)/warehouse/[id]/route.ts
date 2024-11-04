import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { warehouses, locations, NewWarehouse } from '@/drizzle/schema/MasterData/masterData.schema';

// Get detail of a warehouse (including all locations that the warehouse has)
export async function GET(request: NextRequest) {
  try {
    const warehouseId = request.nextUrl.searchParams.get('warehouse_id');
    if (!warehouseId) {
      return NextResponse.json({ error: 'Missing warehouse_id parameter' }, { status: 400 });
    }

    const warehouseDetail = await db
      .select({
        warehouse: {
          name: warehouses.name,
          phone: warehouses.phone,
          address: warehouses.address,
        },
        locations: locations,
      })
      .from(warehouses)
      .leftJoin(locations, eq(warehouses.warehouse_id, locations.warehouse_id))
      .where(eq(warehouses.warehouse_id, Number(warehouseId)));

    if (warehouseDetail.length === 0) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      status_message: "Warehouse detail retrieved",
      data: warehouseDetail,
    });
  } catch (error) {
    console.error('Error retrieving warehouse detail:', error);
    return NextResponse.json({ error: 'Failed to retrieve warehouse detail' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warehouseId = params.id;
    if (!warehouseId) {
      return NextResponse.json({ error: 'Missing warehouse id' }, { status: 400 });
    }

    const updatedWarehouse: Partial<NewWarehouse> = await request.json();

    const editedWarehouse = await db
      .update(warehouses)
      .set(updatedWarehouse)
      .where(eq(warehouses.warehouse_id, Number(warehouseId)))
      .returning();

    if (editedWarehouse.length === 0) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      status_message: "Warehouse updated successfully",
      data: editedWarehouse[0],
    });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warehouseId = params.id;
    if (!warehouseId) {
      return NextResponse.json({ error: 'Missing warehouse id' }, { status: 400 });
    }

    const result = await db.transaction(async (trx) => {
      // Delete associated locations first
      await trx.delete(locations).where(eq(locations.warehouse_id, Number(warehouseId)));

      // Delete the warehouse
      const deletedWarehouse = await trx
        .delete(warehouses)
        .where(eq(warehouses.warehouse_id, Number(warehouseId)))
        .returning();

      if (deletedWarehouse.length === 0) {
        throw new Error('Warehouse not found');
      }

      return deletedWarehouse[0];
    });

    return NextResponse.json({
      status: 200,
      status_message: "Warehouse deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    if (error instanceof Error && error.message === 'Warehouse not found') {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 });
  }
}