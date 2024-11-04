import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  unit_id: serial('unit_id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  symbol: varchar('symbol', { length: 255 }).notNull(),
  created_at: date('created_at').notNull().defaultNow(),
});

export type Unit = InferSelectModel <typeof units>
export type NewUnit = InferInsertModel <typeof units>
