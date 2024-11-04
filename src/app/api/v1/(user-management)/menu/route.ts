import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/drizzle';
import { eq, asc } from 'drizzle-orm';
import { menus, NewMenu } from '@/drizzle/schema/UserManagement/menus.schema';

export async function GET() {
  try {
    const allMenus = await db.select({
      menu_id: menus.menu_id,
      menu_name: menus.name,
      parent: menus.parent,
    }).from(menus).orderBy(asc(menus.name));
    return NextResponse.json({
      status: 200,
      status_message : "Menu data retrieved",
      data : allMenus,
    });
  } catch (error) {
    console.error('Error retrieving menu:', error);
    return NextResponse.json({ error: 'Failed to retrieve menu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {

  try {
    const newMenu: NewMenu = await request.json();

    if (!newMenu.name || !newMenu.url_menu || !newMenu.sort ) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please input the required fields",
        },
        { status: 400 }
      );
    }

    const existingMenu = await db.select().from(menus).where(eq(menus.name, newMenu.name)).limit(1);

    if(existingMenu.length > 0){
      return NextResponse.json(
        {
          status: 400,
          status_message: "Menu already exist",
        },
        { status: 400 }
      );
    }

    const createdMenu = await db.insert(menus).values(newMenu).returning();

    return NextResponse.json(
      {
        status: 201,
        status_message: "Menu created successfully",
        data: createdMenu,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 });
  }
}