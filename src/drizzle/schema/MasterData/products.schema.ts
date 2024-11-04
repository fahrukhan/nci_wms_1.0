import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core'; 
import { categories } from './categories.schema';
import { attributes } from './attributes.schema';
import { units } from './units.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { on } from 'events';

export const products = pgTable('products', {
  product_id: serial('product_id').primaryKey(),
  name: varchar('name').notNull(),
  image: varchar('image').notNull(),
  category_id: integer('category_id').notNull().references(() => categories.category_id),
  attribute1_id: integer('attribute1_id').references(() => attributes.attribute_id), 
  attribute2_id: integer('attribute2_id').references(() => attributes.attribute_id),
  attribute3_id: integer('attribute3_id').references(() => attributes.attribute_id),
  qty_min: integer('qty_min').notNull(),
  qty_max: integer('qty_max').notNull(), 
  unit_base_id: integer('unit_base_id').notNull().references(() => units.unit_id),
  unit_sub_id: integer('unit_sub_id').notNull().references(() => units.unit_id),
  convertion_factor : integer('convertion_factor').notNull(),
  product_code: varchar('product_code').notNull().default(""),
});

export const productAttribute1 = relations(products, ({one}) => ({
  attribute1: one(attributes, {
    fields: [products.attribute1_id],
    references: [attributes.attribute_id]
  }),
}));

export type Product = InferSelectModel <typeof products>
export type NewProduct = InferInsertModel <typeof products>
