// src/app/api/menus/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq } from 'drizzle-orm';
import { Menu, menus } from '@/drizzle/schema/UserManagement/menus.schema';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const menu = await db.select().from(menus).where(eq(menus.menu_id, Number(params.id))).limit(1);
    if (menu.length > 0) {
      return NextResponse.json({
        status: 200,
        status_message: "Menu data retrieved",
        data: menu[0],
      });
    } else {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Menu not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error retrieving menu:', error);
    return NextResponse.json({ error: 'Failed to retrieve menu' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const updatedMenu: Menu = await request.json();
      const result = await db.update(menus).set(updatedMenu).where(eq(menus.menu_id, Number(params.id))).returning();
      if (result.length > 0) {
        return NextResponse.json(
          {
            status: 200,
            status_message: "Menu updated successfully",
            data: result[0],
          },
          { status: 200, }
        );
      } else {
        return NextResponse.json(
          {
            status: 404,
            status_message: "Menu not found",
          },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
    }
  }

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await db.delete(menus).where(eq(menus.menu_id, Number(params.id))).returning();
    if (result.length > 0) {
      return NextResponse.json(
        {
          status: 200,
          status_message: "Menu deleted successfully",
        },
        { status: 200, }
      );
    } else {
      return NextResponse.json(
        {
          status: 404,
          status_message: "Menu not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
  }
}