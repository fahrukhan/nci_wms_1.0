import { pgTable, varchar, timestamp, integer, uuid } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from '../UserManagement/userManagement.schema';
import { locations } from '../MasterData/masterData.schema';


export const relocations = pgTable('relocations', {
  relocation_id: varchar('relocation_id').primaryKey(),  
  relocation_date: timestamp('relocation_date').notNull(),
  origin_id: integer('origin_id').notNull().references(() => locations.location_id),
  destination_id: integer('destination_id').notNull().references(() => locations.location_id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  ref: varchar('ref').notNull(),
  note: varchar('note').notNull(),
  scan_type: varchar('scan_type', { length: 10 }).notNull(), 
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type Relocation = InferSelectModel <typeof relocations>
export type NewRelocation = InferInsertModel <typeof relocations>
