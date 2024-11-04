import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { companies } from './companies.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const warehouses = pgTable('warehouses', {
  warehouse_id: serial('warehouse_id').primaryKey(),
  name: varchar('name').notNull(),
  address: varchar('address').notNull(),
  phone: varchar('phone').notNull(),
  company_id: integer('company_id').notNull().references(() => companies.company_id),
});

export type Warehouse = InferSelectModel<typeof warehouses>
export type NewWarehouse = InferInsertModel<typeof warehouses>
