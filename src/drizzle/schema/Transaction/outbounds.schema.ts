import { pgTable, varchar, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { contacts, locations, warehouses } from '../MasterData/masterData.schema';
import { users } from '../UserManagement/userManagement.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


export const outbounds = pgTable('outbounds', {
  outbound_id: varchar('outbound_id').primaryKey(),
  outbound_date: timestamp('outbound_date').notNull(),
  customer_id: integer('customer_id').notNull().references(() => contacts.contact_id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  warehouse_id: integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
  location_id: integer('location_id').notNull().references(() => locations.location_id),
  ref: varchar('ref').notNull(),
  note: varchar('note').notNull(),
  scan_type: varchar('scan_type', { length: 10 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),  
});

export type Outbound = InferSelectModel <typeof outbounds>
export type NewOutbound = InferInsertModel <typeof outbounds>
