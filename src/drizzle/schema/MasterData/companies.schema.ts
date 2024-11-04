import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  company_id: serial('company_id').primaryKey(),
  name: varchar('name').notNull(),
  address: varchar('address').notNull(),
  phone: varchar('phone').notNull(),
});