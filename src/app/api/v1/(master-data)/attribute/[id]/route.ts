import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { attributes, NewAttribute } from '@/drizzle/schema/MasterData/masterData.schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params : { id : string }}) {
    try {

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const perPage = parseInt(searchParams.get('perPage') || '10');

      const offset = (page - 1) * perPage;

      const attribute = await db.select().from(attributes).where(eq(attributes.attribute_id, Number(params.id))).offset(offset).limit(perPage);
  
      if (attribute.length === 0) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
      }

      const totalCountResult = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(attributes);
      
const totalCount = Number(totalCountResult[0].count);
  
      return NextResponse.json({
        status: 200,
        status_message: 'Attribute retrieved successfully',
        data: attribute[0],
        pagination: {
          currentPage: page,
          perPage: perPage,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / perPage),
        },
      });
    } catch (error) {
      console.error('Error retrieving attribute:', error);
      return NextResponse.json({ error: 'Failed to retrieve attribute' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, { params }: { params : { id : string }}) {
    try {
  
      const reqData: Partial<NewAttribute> = await request.json();
  
      if (!reqData.name && !reqData.type && !reqData.list) {
        return NextResponse.json(
          {
            status: 400,
            status_message: 'At least one field is required',
            data: {},
          },
          { status: 400 }
        );
      }
  
      const updatedAttribute = await db
        .update(attributes)
        .set(reqData)
        .where(eq(attributes.attribute_id, Number(params.id)))
        .returning();
  
      if (updatedAttribute.length === 0) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        status_message: 'Attribute updated successfully',
        data: updatedAttribute[0],
      });
    } catch (error) {
      console.error('Error updating attribute:', error);
      return NextResponse.json({ error: 'Failed to update attribute' }, { status: 500 });
    }
  }
  
  // Delete an attribute
  export async function DELETE(request: NextRequest, { params } : { params : { id : string }}) {
    
    try {
  
      const deletedAttribute = await db
      .delete(attributes)
      .where(eq(attributes.attribute_id, Number(params.id)))
      .returning()

      if (deletedAttribute.length === 0) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        status_message: 'Attribute deleted successfully',
        data: deletedAttribute[0],
      });
    } catch (error) {
      console.error('Error deleting attribute:', error);
      return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 });
    }
  }