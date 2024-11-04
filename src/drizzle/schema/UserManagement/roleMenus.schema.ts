import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const roleMenus = pgTable("role_menus", {
  id: serial("role_menu_id").primaryKey(),
  role_id: integer("role_id").notNull(),
  menu_id: integer("menu_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type RoleMenu = InferSelectModel<typeof roleMenus>;
export type NewRoleMenu = InferInsertModel<typeof roleMenus>;
