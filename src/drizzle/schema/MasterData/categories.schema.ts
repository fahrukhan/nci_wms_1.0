import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  category_id: serial('category_id').primaryKey(),
  name: varchar('name').notNull(),
});
export type Category = InferSelectModel <typeof categories>
export type NewCategory = InferInsertModel <typeof categories>
