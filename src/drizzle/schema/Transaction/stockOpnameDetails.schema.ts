
import { pgTable, varchar, integer, uuid, text } from 'drizzle-orm/pg-core';
import { stock_opnames } from './stockOpnames.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { products } from '../MasterData/products.schema';

export const stock_opname_details = pgTable('stock_opname_details', {
  stock_opname_id: varchar('stock_opname_id').notNull().references(() => stock_opnames.stock_opname_id),
  stock_opname_detail_id: varchar('stock_opname_detail_id', { length: 255 }).primaryKey(),
  product_id: integer('product_id').notNull().references(() => products.product_id),
  item_id: text('item_id').notNull(),
});

export type StockOpnameDetail = InferSelectModel <typeof stock_opname_details>
export type NewStockOpnameDetail = InferInsertModel <typeof stock_opname_details>
