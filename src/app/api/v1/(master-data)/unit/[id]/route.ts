import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq } from 'drizzle-orm';

import { NewUnit, units } from '@/drizzle/schema/MasterData/masterData.schema';

// Get detail of a unit
export async function GET(request: NextRequest, {params} : {params : {id : string}}) {
    try {
  
      const unitDetail = await db
        .select()
        .from(units)
        .where(eq(units.unit_id, Number(params.id)))
        .limit(1);
  
      if (unitDetail.length === 0) {
        return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        status_message: "Unit detail retrieved",
        data: unitDetail[0],
      });
    } catch (error) {
      console.error('Error retrieving unit detail:', error);
      return NextResponse.json({ error: 'Failed to retrieve unit detail' }, { status: 500 });
    }
}


// Update a unit
export async function PUT(request: NextRequest, {params} : {params : {id : string}}) {
  try {

    const updatedUnit: Partial<NewUnit> = await request.json();

    const editedUnit = await db
      .update(units)
      .set(updatedUnit)
      .where(eq(units.unit_id, Number(params.id)))
      .returning();

    if (editedUnit.length === 0) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: 200,
        status_message: "Unit updated successfully",
        data: editedUnit[0],
      },
      { status: 200, }
    );
  } catch (error) {
    console.error('Error updating unit:', error);
    return NextResponse.json({ error: 'Failed to update unit' }, { status: 500 });
  }
}


// Delete a unit
export async function DELETE(request: NextRequest, {params} : {params : {id : string}}) {
    try {
  
      const deletedUnit = await db
        .delete(units)
        .where(eq(units.unit_id, Number(params.id)))
        .returning();
  
      if (deletedUnit.length === 0) {
        return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
      }
  
      return NextResponse.json(
        {
          status: 200,
          status_message: "Unit deleted successfully",
          data: deletedUnit[0],
        },
        { status: 200, }
      );
    } catch (error) {
      console.error('Error deleting unit:', error);
      return NextResponse.json({ error: 'Failed to delete unit' }, { status: 500 });
  }
}