import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

// Users table — reflects DummyJSON user shape.
// id is a serial integer (auto-increment) to match DummyJSON's numeric user IDs.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  // `image` matches DummyJSON's avatar field name (not `avatarUrl`).
  image: text("image"),
  role: varchar("role", { length: 32 }).notNull().default("customer"),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 32 }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
