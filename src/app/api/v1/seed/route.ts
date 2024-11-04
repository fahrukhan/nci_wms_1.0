import { db } from "@/drizzle/drizzle";
import { menus } from "@/drizzle/schema/UserManagement/menus.schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const menuData = [
  {
    name: "attribute",
    parent: "master",
    url_menu: "/master/attribute",
    sort: 1,
  },
  {
    name: "category",
    parent: "master",
    url_menu: "/master/category",
    sort: 2,
  },
  {
    name: "customer",
    parent: "master",
    url_menu: "/master/customer",
    sort: 3,
  },
  {
    name: "location",
    parent: "master",
    url_menu: "/master/location",
    sort: 4,
  },
  {
    name: "product",
    parent: "master",
    url_menu: "/master/product",
    sort: 5,
  },
  {
    name: "supplier",
    parent: "master",
    url_menu: "/master/supplier",
    sort: 6,
  },
  {
    name: "unit",
    parent: "master",
    url_menu: "/master/unit",
    sort: 7,
  },
  {
    name: "warehouse",
    parent: "master",
    url_menu: "/master/warehouse",
    sort: 8,
  },
  {
    name: "inbound",
    parent: "report",
    url_menu: "/report/inbound",
    sort: 1,
  },
  {
    name: "outbound",
    parent: "report",
    url_menu: "/report/outbound",
    sort: 2,
  },
  {
    name: "stock-opname",
    parent: "report",
    url_menu: "/report/stock-opname",
    sort: 3,
  },
  {
    name: "relocation",
    parent: "report",
    url_menu: "/report/relocation",
    sort: 4,
  },
  {
    name: "transfer",
    parent: "report",
    url_menu: "/report/transfer",
    sort: 5,
  },
  {
    name: "tag-registration",
    parent: "log",
    url_menu: "/log/tag-registration",
    sort: 1,
  },
  {
    name: "current-stock",
    parent: "log",
    url_menu: "/log/current-stock",
    sort: 2,
  },
  {
    name: "tracking",
    parent: "log",
    url_menu: "/log/tracking",
    sort: 3,
  },
  {
    name: "users",
    parent: "user-management",
    url_menu: "/user-management/users",
    sort: 3,
  },
  {
    name: "roles",
    parent: "user-management",
    url_menu: "/user-management/roles",
    sort: 4,
  },
];

export async function GET() {
  try {
    const insertedMenus = [];
    const skippedMenus = [];

    for (const menu of menuData) {
      // Check if the menu name already exists
      const existingMenu = await db
        .select()
        .from(menus)
        .where(eq(menus.name, menu.name))
        .execute();

      if (existingMenu.length === 0) {
        // If the menu doesn't exist, insert it
        await db.insert(menus).values(menu).execute();
        insertedMenus.push(menu.name);
      } else {
        // If the menu already exists, skip it
        skippedMenus.push(menu.name);
      }
    }

    return NextResponse.json({
      status: 200,
      status_message: "Seed data insertion completed",
      data: {
        inserted: insertedMenus,
        skipped: skippedMenus,
      },
    });
  } catch (error: any) {
    console.error("Error seeding data:", error);
    return NextResponse.json({
      status: 500,
      status_message: "Error seeding data",
      error: error.message,
    });
  }
}
