import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getUserFromSession, validateBearerToken } from "@/lib/utils/AuthUtils";
import { db } from "@/drizzle/drizzle";
import { menus } from "@/drizzle/schema/UserManagement/menus.schema";
import {
  roleMenus,
  roles,
  users,
} from "@/drizzle/schema/UserManagement/userManagement.schema";

export async function GET(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userMenus = await db
      .select({
        menu_id: menus.menu_id,
        name: menus.name,
        parent: menus.parent,
        url_menu: menus.url_menu,
        sort: menus.sort,
      })
      .from(menus)
      .innerJoin(roleMenus, eq(menus.menu_id, roleMenus.menu_id))
      .innerJoin(roles, eq(roleMenus.role_id, roles.role_id))
      .innerJoin(users, eq(roles.role_id, users.role_id))
      .where(eq(users.id, user.id))
      .orderBy(menus.sort);

    return NextResponse.json({
      status: 200,
      status_message: "Menu data retrieved",
      data: userMenus,
    });
  } catch (error) {
    console.error("Error retrieving user menu:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user menu" },
      { status: 500 }
    );
  }
}
