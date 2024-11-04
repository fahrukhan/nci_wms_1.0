import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';
import { companies } from '../MasterData/companies.schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  phone: varchar('phone').notNull().default(''),
  username: varchar('username').notNull().default(''),
  role_id: integer('role_id').notNull().references(() => roles.role_id),
  company_id: integer('company_id').references(() => companies.company_id),
  url_picture: varchar('url_picture').notNull().default(''),
  created_at: timestamp('created_at').notNull().defaultNow(),
});


export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
