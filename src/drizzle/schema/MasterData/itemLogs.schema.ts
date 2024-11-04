
import { pgTable, varchar, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { users } from '../UserManagement/users.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const item_logs = pgTable('item_logs', {
  item_log_id: uuid('item_log_id').primaryKey().defaultRandom(),
  item_id: text('item_id').notNull(),
  note: varchar('note', { length: 255 }).notNull(),
  ref: varchar('ref', { length: 255 }).notNull(),
  activity: varchar('activity', { length: 255 }).notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type ItemLogs = InferSelectModel <typeof item_logs>
export type NewItemLogs = InferInsertModel <typeof item_logs>
