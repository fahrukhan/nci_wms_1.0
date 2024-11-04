import { pgTable, varchar, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { warehouses } from '../MasterData/warehouses.schema';
import { users } from '../UserManagement/users.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


export const transfers = pgTable('transfers', {
  transfer_id: varchar('transfer_id').primaryKey(),  
  transfer_date: timestamp('transfer_date').notNull(),
  received_date: timestamp('received_date'),
  origin_id: integer('origin_id').notNull().references(() => warehouses.warehouse_id),
  destination_id: integer('destination_id').notNull().references(() => warehouses.warehouse_id),
  origin_user_id: uuid('origin_user_id').notNull().references(() => users.id),
  destination_user_id: uuid('destination_user_id').references(() => users.id),
  ref: varchar('ref').notNull(),
  note: varchar('note').notNull(),
  receive_note: varchar('receive_note').notNull().default(""),
  scan_type: varchar('scan_type', { length: 10 }).notNull(), 
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type Transfer = InferSelectModel <typeof transfers>
export type NewTransfer = InferInsertModel <typeof transfers>
