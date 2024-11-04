import { db } from '@/drizzle/drizzle';
import { roles, roleMenus, menus, users } from '@/drizzle/schema/UserManagement/userManagement.schema';
import { lucia } from '@/lucia/auth';
import { and, eq, sql } from 'drizzle-orm';

async function checkMenuPermission(userToken: string, menuId: number) {
  try {
    // Validate and decode the user token using Lucia-auth
    const sessionId = lucia.readBearerToken(userToken ?? "");
    if (!sessionId) {
      return new Response(null, {
        status: 401
      });
    }
    const { session, user } = await lucia.validateSession(sessionId);

    if (!user) {
      return new Response(null, {
        status: 401
      });
    }

    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    if (currentUser.length === 0) {
      return new Response(null, {
        status: 404,
        statusText: "User not found"
      });
    }

    const roleId = currentUser[0].role_id;

    // Check if the user's role has access to the specified menu item
    const hasMenuPermission = await db
      .select({
        menu_ids: sql<string>`string_agg(${roleMenus.menu_id}, ',')`
      })
      .from(roleMenus)
      .where(eq(roleMenus.role_id, roleId))
      .limit(1);

    if (hasMenuPermission.length === 0) {
      return false;
    }

    const menuIdsString = hasMenuPermission[0].menu_ids;
    const menuIdsArray = menuIdsString.split(',').map(Number);

    return menuIdsArray.includes(menuId);
  } catch (error) {
    console.error('Error checking menu permission:', error);
    return false;
  }
}
