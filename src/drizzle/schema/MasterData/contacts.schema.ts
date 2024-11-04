import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const contacts = pgTable('contacts', {  
  contact_id: serial('contact_id').primaryKey(),
  name: varchar('name').notNull(),
  address: varchar('address').notNull(), 
  phone: varchar('phone').notNull(),
  type: text('type', { enum : ["supplier" , "customer"]}).notNull().default("customer"),
});

export type Contact = InferSelectModel <typeof contacts>
export type NewContact = InferInsertModel <typeof contacts>
