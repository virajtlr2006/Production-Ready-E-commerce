import { bigint } from "drizzle-orm/gel-core";
import { boolean } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// Admin Table
export  const adminTable  = pgTable("admin", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  isApproved:boolean().default(false),
});

// User Table
export const UserTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar().notNull(),
  email: varchar().notNull(),
  password: varchar().notNull(),
  phone_no : bigint().notNull(),
  profile_pic : varchar().default("https://imgs.search.brave.com/pkPyTQFTOVFQw7Hki6hg6cgY5FPZ3UzkpUMsnfiuznQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/MS85MC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zaW1wbGUtZmxh/dC12ZWN0b3ItNTcy/MzQxOTAuanBn"),
})

// Product Table
export const ProductTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull(),
  category: varchar().notNull(),
  p_name: varchar().notNull(),
  description: varchar().notNull(),
  price: integer().notNull(),
  image_url: varchar().notNull(),
  stock: integer().notNull(),
  isApproved:boolean().default(false),
});

// Payment Table
export const PaymentTable = pgTable("payments", {
  invoice_no: integer().primaryKey().generatedAlwaysAsIdentity(),
  buyer_email: varchar().notNull(),
  product_id: integer().notNull(),
  amount: integer().notNull(),
  quantity: integer().notNull().default(1),
  type: varchar().notNull(), // UPI or Card or COD
  card_no: bigint(),
  UPI_ID: varchar(),
});


export const NotificationTable = pgTable("notifications" , {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  user_id: varchar().notNull(),
  title: varchar().notNull(),
  message: varchar().notNull(),
})