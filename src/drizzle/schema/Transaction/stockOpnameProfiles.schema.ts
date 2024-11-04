
import { pgTable, varchar, timestamp, uuid, integer } from 'drizzle-orm/pg-core';  
import { users } from '../UserManagement/userManagement.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { warehouses } from '../MasterData/warehouses.schema';

export const stock_opname_profiles = pgTable('stock_opname_profiles', {
  stock_opname_profile_id: varchar('stock_opname_profile_id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  warehouse_id: integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type StockOpnameProfile = InferSelectModel <typeof stock_opname_profiles>
export type NewStockOpnameProfile = InferInsertModel <typeof stock_opname_profiles>
