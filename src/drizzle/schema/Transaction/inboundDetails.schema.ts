import { pgTable, varchar, integer, uuid, text } from 'drizzle-orm/pg-core';
import { inbounds } from './inbounds.schema';
import { items, products } from '../MasterData/masterData.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


export const inbound_details = pgTable('inbound_details', {
  inbound_detail_id: uuid('inbound_detail_id').primaryKey().notNull(),
  inbound_id: varchar('inbound_id').notNull().references(() => inbounds.inbound_id),
  item_id: text('item_id').notNull(),
  product_id: integer('product_id').notNull().references(() => products.product_id),
});

export type InboundDetail = InferSelectModel <typeof inbound_details>
export type NewInboundDetail = InferInsertModel <typeof inbound_details>
