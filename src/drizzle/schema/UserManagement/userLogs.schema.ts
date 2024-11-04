import { pgTable, varchar, timestamp, uuid, json } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const user_logs = pgTable('user_logs', {
  user_log_id: uuid('user_log_id').primaryKey().defaultRandom(),
  device: json('device').notNull(),
  version: varchar('version', { length: 255 }).notNull(),
  activity: varchar('activity', { length: 255 }).notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  ref: varchar('ref', { length: 255 }).notNull(),
  note: varchar('note', { length: 255 }).notNull(),
});

export type UserLog = InferSelectModel <typeof user_logs>
export type NewUserLog = InferInsertModel <typeof user_logs>
