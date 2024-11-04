import { pgTable, varchar, integer, text, uuid } from 'drizzle-orm/pg-core';
import { transfers } from './transfers.schema';
import { products } from '../MasterData/masterData.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const transfer_details = pgTable('transfer_details', {
  transfer_detail_id: uuid('transfer_detail_id').primaryKey(),
  transfer_id: varchar('transfer_id').notNull().references(() => transfers.transfer_id),
  item_id: text('item_id').notNull(),
  item_id_missing: text('item_id_missing').notNull().default(""),
  product_id: integer('product_id').notNull().references(() => products.product_id),
});

export type TransferDetail = InferSelectModel <typeof transfer_details>
export type NewTransferDetail = InferInsertModel <typeof transfer_details>
