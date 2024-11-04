import { NextRequest, NextResponse } from "next/server";
import {
  menus,
  roleMenus,
  roles,
  users,
  userWarehouses,
} from "@/drizzle/schema/UserManagement/userManagement.schema";
import { eq, inArray } from "drizzle-orm";
import { lucia } from "@/lucia/auth";
import bcrypt from "bcrypt";
import { db } from "@/drizzle/drizzle";
import {
  companies,
  warehouses,
} from "@/drizzle/schema/MasterData/masterData.schema";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // check if there is any empty field
  if (!email || !password) {
    return NextResponse.json(
      {
        status: 400,
        status_message: "Please input email and password",
        data: null,
      },
      { status: 400 }
    );
  }

  // Check if the user exist
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length == 0) {
    return NextResponse.json(
      {
        status: 400,
        status_message: "Incorrect email or password",
        data: null,
      },
      { status: 400 }
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser[0].password
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        status: 400,
        status_message: "Incorrect email or password",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    let company = null;
    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, existingUser[0].role_id))
      .limit(1);
    if (existingUser[0].company_id !== null) {
      [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.company_id, existingUser[0].company_id))
        .limit(1);
    }

    const userWarehouseIds = await db
      .select({ warehouse_id: userWarehouses.warehouse_id })
      .from(userWarehouses)
      .where(eq(userWarehouses.user_id, existingUser[0].id));

    const warehouseData = await db
      .select({ id: warehouses.warehouse_id, name: warehouses.name })
      .from(userWarehouses)
      .leftJoin(
        warehouses,
        eq(userWarehouses.warehouse_id, warehouses.warehouse_id)
      )
      .where(eq(userWarehouses.user_id, existingUser[0].id))
      .execute();

    if (
      warehouseData.length === 0 &&
      existingUser[0].email !== "admin@mail.com"
    ) {
      return NextResponse.json(
        {
          status: 400,
          status_message: "Please ask admin to add warehouse",
          data: null,
        },
        { status: 400 }
      );
    }

    const menuData = await getMenuForRole(existingUser[0].role_id);

    // Create a new session for the user
    const session = await lucia.createSession(existingUser[0].id, {
      role_id: existingUser[0].role_id,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    const response = NextResponse.json(
      {
        status: 200,
        status_message: "User logged in successfully",
        data: {
          email: existingUser[0].email,
          username: existingUser[0].username,
          phone: existingUser[0].phone,
          company: company == null ? " " : company.name,
          url_picture: existingUser[0].url_picture,
          token: sessionCookie.value,
          warehouses: warehouseData.map(({ name, id }) => ({ id, name })),
          role: role.name,
          menu: menuData,
        },
      },
      { status: 200 }
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      {
        status: 500,
        status_message: "Failed to log in",
        data: error,
      },
      { status: 500 }
    );
  }
}

async function getMenuForRole(roleId: number) {
  const roleMenu = await db
    .select({
      menu_id: roleMenus.menu_id,
    })
    .from(roleMenus)
    .where(eq(roleMenus.role_id, roleId));

  const menuIds = roleMenu.map((rm) => rm.menu_id);

  const menuItems = await db
    .select({
      menu_id: menus.menu_id,
      name: menus.name,
      parent: menus.parent,
      url_menu: menus.url_menu,
    })
    .from(menus)
    .where(inArray(menus.menu_id, menuIds));

  // Add an empty children array to each menu item
  const menuWithChildren = menuItems.map((item) => ({
    ...item,
    children: [],
  }));

  return menuWithChildren;
}
