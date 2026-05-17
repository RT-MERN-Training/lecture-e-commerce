import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  doublePrecision,
  real,
} from "drizzle-orm/pg-core";

// Products table — reflects DummyJSON product shape.
// id is serial (auto-increment) to match DummyJSON's numeric product IDs.
// brand is nullable since some DummyJSON products omit it.
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discountPercentage: real("discount_percentage").notNull().default(0),
  rating: real("rating").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  // brand is optional — some DummyJSON product categories omit it.
  brand: varchar("brand", { length: 100 }),
  category: varchar("category", { length: 100 }).notNull(),
  thumbnail: text("thumbnail").notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
