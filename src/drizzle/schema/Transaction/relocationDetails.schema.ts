import { pgTable, varchar, integer, text, uuid } from 'drizzle-orm/pg-core';
import { products } from '../MasterData/masterData.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relocations } from './relocation.schema';

export const relocation_details = pgTable('relocation_details', {
  relocation_detail_id: uuid('relocation_detail_id').primaryKey(),
  relocation_id: varchar('relocation_id').notNull().references(() => relocations.relocation_id),
  item_id: text('item_id').notNull(),
  product_id: integer('product_id').notNull().references(() => products.product_id),
});

export type RelocationDetail = InferSelectModel <typeof relocation_details>
export type NewRelocationDetail = InferInsertModel <typeof relocation_details>
