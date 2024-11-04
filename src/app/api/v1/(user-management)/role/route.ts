import { db } from "@/drizzle/drizzle";
import {
  menus,
  roleMenus,
  roles,
} from "@/drizzle/schema/UserManagement/userManagement.schema";
import {
  createUnauthorizedResponse,
  getUserFromSession,
  validateBearerToken,
} from "@/lib/utils/AuthUtils";
import { asc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const perPage = parseInt(searchParams.get("perPage") ?? "10");
    const offset = (page - 1) * perPage;

    const rolesData = await db
      .select({
        role_id: roles.role_id,
        role_name: roles.name,
        menus: sql<string>`STRING_AGG(${menus.name}, ', ' ORDER BY ${menus.name})`,
        menu_ids: sql<string>`STRING_AGG(${menus.menu_id}::text, ',' ORDER BY ${menus.menu_id})`,
      })
      .from(roles)
      .leftJoin(roleMenus, eq(roles.role_id, roleMenus.role_id))
      .leftJoin(menus, eq(roleMenus.menu_id, menus.menu_id))
      .groupBy(roles.role_id, roles.name)
      .orderBy(asc(roles.name))
      .offset(offset)
      .limit(perPage);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${roles.role_id})` })
      .from(roles);

    return NextResponse.json({
      status: 200,
      status_message: "Roles data retrieved",
      data: rolesData,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: Number(count),
        totalPages: Math.ceil(Number(count) / perPage),
      },
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await validateBearerToken(request);
    if (!session) {
      return createUnauthorizedResponse("Missing or invalid bearer token");
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return createUnauthorizedResponse("User not found");
    }

    const { role_name, menu_ids }: { role_name: string; menu_ids: string } =
      await request.json();

    const newRole = await db.transaction(async (tx) => {
      const [role] = await tx
        .insert(roles)
        .values({ name: role_name })
        .returning();

      const menuIdsArray = menu_ids.split(",").filter(Boolean).map(Number);

      if (menuIdsArray.length > 0) {
        await tx.insert(roleMenus).values(
          menuIdsArray.map((menuId) => ({
            role_id: role.role_id,
            menu_id: menuId,
          }))
        );
      }

      return role;
    });

    return NextResponse.json({
      status: 201,
      status_message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
