import { pgTable, serial, integer,varchar, timestamp } from 'drizzle-orm/pg-core';
import { units } from './units.schema';

export const unit_converts = pgTable('unit_converts', {
  unit_convert_id: serial('unit_convert_id').primaryKey(), 
  unit_base_id: integer('unit_base_id').notNull().references(() => units.unit_id),
  unit_sub_id: integer('unit_sub_id').notNull().references(() => units.unit_id),
  conversion_factor: integer('conversion_factor').notNull(),
  created_at: varchar('created_at', { length: 255 }).notNull(), 
  updated_at: timestamp('updated_at').notNull(),
});
