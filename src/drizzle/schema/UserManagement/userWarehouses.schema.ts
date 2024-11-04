import { pgTable, timestamp, uuid, serial, integer } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { warehouses } from '../MasterData/warehouses.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const userWarehouses = pgTable('user_warehouses', {
  user_warehouse_id: serial('user_warehouse_id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  warehouse_id : integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type UserWarehouses = InferSelectModel <typeof userWarehouses>
export type NewUserWarehouses = InferInsertModel <typeof userWarehouses>
