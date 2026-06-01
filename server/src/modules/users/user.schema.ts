import { pgTable, serial, varchar, text, jsonb } from "drizzle-orm/pg-core";

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
  // preferences: JSONB object groups user settings that change frequently and vary
  // by feature rollout. Adding new preferences (e.g., darkModeSchedule, fontSize)
  // doesn't require migrations. All optional fields avoid NULL columns.
  preferences: jsonb("preferences")
    .$type<{
      theme?: "light" | "dark" | "auto";
      language?: string;
      currency?: string;
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      marketingEmails?: boolean;
    }>()
    .default({}),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
