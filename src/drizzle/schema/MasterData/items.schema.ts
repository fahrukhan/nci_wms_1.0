import { pgTable, varchar, integer, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { products } from './products.schema';
import { locations } from './locations.schema';
import { warehouses } from './warehouses.schema';
import { contacts } from './contacts.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const items = pgTable('items', {
  item_id: varchar('item_id', { length: 255 }).primaryKey(),
  rfid: varchar('rfid', { length: 255 }).unique().notNull(),
  qr: varchar('qr', { length: 500 }).notNull(),
  in_stock: boolean('in_stock').notNull(),
  gin: varchar('gin', { length: 255 }).notNull(),
  on_transfer: boolean('on_transfer').notNull(),
  attribute1_value: varchar('attribute1_value', { length: 255 }),
  attribute2_value: varchar('attribute2_value', { length: 255 }),
  attribute3_value: varchar('attribute3_value', { length: 255 }),
  product_id: integer('product_id').notNull().references(() => products.product_id),
  location_id: integer('location_id').references(() => locations.location_id),
  warehouse_id: integer('warehouse_id').notNull().references(() => warehouses.warehouse_id),
  supplier_id: integer('supplier_id').notNull().references(() => contacts.contact_id),
  has_expired_date: boolean('has_expired_date').notNull(),
  expired_date: timestamp('expired_date'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
export type Item = InferSelectModel <typeof items>
export type NewItem = InferInsertModel <typeof items>
