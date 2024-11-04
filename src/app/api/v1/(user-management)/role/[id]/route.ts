import { NextRequest, NextResponse } from "next/server";
import { eq, param, sql } from "drizzle-orm";
import {
  menus,
  Role,
  roleMenus,
  roles,
} from "@/drizzle/schema/UserManagement/userManagement.schema";
import { db } from "@/drizzle/drizzle";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);
    const role = await db
      .select({
        role_id: roles.role_id,
        role_name: roles.name,
        menus: sql`STRING_AGG(${menus.name}, ', ' ORDER BY ${menus.name})`,
        menu_ids: sql`STRING_AGG(${menus.menu_id}::text, ',' ORDER BY ${menus.menu_id})`,
      })
      .from(roles)
      .leftJoin(roleMenus, eq(roles.role_id, roleMenus.role_id))
      .leftJoin(menus, eq(roleMenus.menu_id, menus.menu_id))
      .where(eq(roles.role_id, roleId))
      .groupBy(roles.role_id, roles.name)
      .limit(1);

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, data: role });
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);
    const { role_name, menu_ids } = await request.json();

    const updatedRole = await db.transaction(async (tx) => {
      const [role] = await tx
        .update(roles)
        .set({ name: role_name })
        .where(eq(roles.role_id, roleId))
        .returning();

      await tx.delete(roleMenus).where(eq(roleMenus.role_id, roleId));

      const menuIdsArray = menu_ids.split(",").filter(Boolean).map(Number);

      if (menuIdsArray.length > 0) {
        await tx.insert(roleMenus).values(
          menuIdsArray.map((menuId: string) => ({
            role_id: roleId,
            menu_id: menuId,
          }))
        );
      }

      return role;
    });

    return NextResponse.json({ status: 200, data: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);

    await db.transaction(async (tx) => {
      await tx.delete(roleMenus).where(eq(roleMenus.role_id, roleId));
      await tx.delete(roles).where(eq(roles.role_id, roleId));
    });

    return NextResponse.json({
      status: 200,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
