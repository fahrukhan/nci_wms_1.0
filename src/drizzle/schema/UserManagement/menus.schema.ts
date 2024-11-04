import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const menus = pgTable("menus", {
  menu_id: serial("menu_id").primaryKey(),
  name: varchar("name").notNull(),
  parent: varchar("parent").notNull().default("0"),
  url_menu: varchar("url_menu").notNull(),
  sort: integer("sort").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type Menu = InferSelectModel<typeof menus>;
export type NewMenu = InferInsertModel<typeof menus>;
