import { pgTable, varchar, integer, serial } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const locations = pgTable('locations', {
  location_id: serial('location_id').primaryKey(),
  name: varchar('name').notNull(),
  parent_id: integer('parent_id'),
  path: varchar('path').notNull().default(''),
  pathName : varchar('path_name').notNull().default(''),
  warehouse_id: integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
});

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;
