import { pgTable, serial, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../users/user.schema";
import { products } from "../products/product.schema";

// Carts table — integer FK to match serial user IDs.
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: numeric("total", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  discountedTotal: numeric("discounted_total", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
});

// Cart items — integer FKs for cart and product.
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  priceAtAdd: numeric("price_at_add", { precision: 10, scale: 2 }).notNull(),
});

export const cartsRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  user: one(users, { fields: [carts.userId], references: [users.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
