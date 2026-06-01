import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  doublePrecision,
  real,
  jsonb,
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
  // images: JSONB array allows variable-length image galleries per product without
  // creating separate image table or fixed column count. Easy to append/remove images.
  images: jsonb("images").$type<string[]>().default([]),
  // metadata: JSONB object stores category-specific attributes (e.g., electronics have
  // warranty, furniture has dimensions). Avoids sparse columns and allows schema-free
  // evolution as new product categories are added without migrations.
  metadata: jsonb("metadata")
    .$type<{
      weight?: number;
      dimensions?: { width: number; height: number; depth: number };
      warrantyInformation?: string;
      shippingInformation?: string;
      availabilityStatus?: string;
      returnPolicy?: string;
      minimumOrderQuantity?: number;
    }>()
    .default({}),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
