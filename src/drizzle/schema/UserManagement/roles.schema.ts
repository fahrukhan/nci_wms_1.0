import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  role_id: serial('role_id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),  
});


export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;
