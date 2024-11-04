import { pgTable, varchar, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { warehouses, contacts, locations } from '../MasterData/masterData.schema';
import { users } from '../UserManagement/userManagement.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


export const inbounds = pgTable('inbounds', {
  inbound_id: varchar('inbound_id').primaryKey(),
  inbound_date: timestamp('inbound_date').notNull(),
  supplier_id: integer('supplier_id').notNull().references(() => contacts.contact_id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  warehouse_id: integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
  location_id: integer('location_id').notNull().references(() => locations.location_id),
  ref: varchar('ref').notNull(), 
  note: varchar('note').notNull(),
  scan_type: varchar('scan_type', { length: 10 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type Inbound = InferSelectModel <typeof inbounds>
export type NewInbound = InferInsertModel <typeof inbounds>
