
import { pgTable, varchar, timestamp, uuid, integer, PgDate, date } from 'drizzle-orm/pg-core';  
import { users } from '../UserManagement/userManagement.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { stock_opname_profiles } from './stockOpnameProfiles.schema';
import { locations } from '../MasterData/locations.schema';

export const stock_opnames = pgTable('stock_opnames', {
  stock_opname_id: varchar('stock_opname_id', { length: 255 }).primaryKey(),
  stock_opname_date: date('stock_opname_date', {mode: "date"}).notNull(),
  stock_opname_profile_id: varchar('stock_opname_profile_id').notNull().references(() => stock_opname_profiles.stock_opname_profile_id),
  location_id: integer('location_id').notNull().references(() => locations.location_id ),
  scan_type: varchar('scan_type', { length: 10 }).notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type StockOpname = InferSelectModel <typeof stock_opnames>
export type NewStockOpname = InferInsertModel <typeof stock_opnames>