import { pgTable, varchar, integer, text, uuid } from 'drizzle-orm/pg-core';
import { outbounds } from './outbounds.schema';
import { products } from '../MasterData/masterData.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const outbound_details = pgTable('outbound_details', {
  outbound_detail_id: uuid('outbound_detail_id').primaryKey().notNull(),
  outbound_id: varchar('outbound_id').notNull().references(() => outbounds.outbound_id),
  item_id: text('item_id').notNull(),
  product_id: integer('product_id').notNull().references(() => products.product_id),
});

export type OutboundDetail = InferSelectModel <typeof outbound_details>
export type NewOutboundDetail = InferInsertModel <typeof outbound_details>