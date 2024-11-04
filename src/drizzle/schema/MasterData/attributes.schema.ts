import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const attributes = pgTable('attributes', {
  attribute_id: serial('attribute_id').primaryKey(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  list: text('list').notNull().default(""),
});
export type Attribute = InferSelectModel <typeof attributes>
export type NewAttribute = InferInsertModel <typeof attributes>
