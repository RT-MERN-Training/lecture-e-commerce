import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
  carts,
  cartItems,
  type Cart,
  type CartItem,
  type NewCart,
} from "./cart.schema";

export type CartProductItem = {
  id: number;
  productId: number;
  quantity: number;
  priceAtAdd: number;
};

export type CartResponse = {
  id: number;
  userId: number;
  products: CartProductItem[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
};

const toCartResponse = (cart: Cart, items: CartItem[]): CartResponse => {
  const products: CartProductItem[] = items.map((i) => ({
    id: i.id,
    productId: i.productId,
    quantity: i.quantity,
    priceAtAdd: Number(i.priceAtAdd),
  }));
  const total = Number(cart.total);
  const discountedTotal = Number(cart.discountedTotal);
  return {
    id: cart.id,
    userId: cart.userId,
    products,
    total,
    discountedTotal,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
  };
};

export class CartRepository {
  async findById(id: number): Promise<CartResponse | null> {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.id, id))
      .limit(1);
    if (!cart) return null;
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, id));
    return toCartResponse(cart, items);
  }

  async findByUserId(userId: number): Promise<CartResponse | null> {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);
    if (!cart) return null;
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));
    return toCartResponse(cart, items);
  }

  async findAll(): Promise<CartResponse[]> {
    const rows = await db.select().from(carts);
    const result: CartResponse[] = [];
    for (const cart of rows) {
      const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));
      result.push(toCartResponse(cart, items));
    }
    return result;
  }

  async create(data: NewCart): Promise<CartResponse> {
    const [row] = await db.insert(carts).values(data).returning();
    return toCartResponse(row, []);
  }

  async replaceItems(
    cartId: number,
    items: { productId: number; quantity: number; priceAtAdd: number }[],
  ): Promise<CartResponse | null> {
    return db.transaction(async (tx) => {
      const [cart] = await tx
        .select()
        .from(carts)
        .where(eq(carts.id, cartId))
        .limit(1);
      if (!cart) return null;

      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));

      let inserted: CartItem[] = [];
      if (items.length > 0) {
        inserted = await tx
          .insert(cartItems)
          .values(
            items.map((i) => ({
              cartId,
              productId: i.productId,
              quantity: i.quantity,
              priceAtAdd: i.priceAtAdd.toFixed(2),
            })),
          )
          .returning();
      }

      const total = inserted.reduce(
        (sum, it) => sum + Number(it.priceAtAdd) * it.quantity,
        0,
      );
      const [updatedCart] = await tx
        .update(carts)
        .set({ total: total.toFixed(2), discountedTotal: total.toFixed(2) })
        .where(eq(carts.id, cartId))
        .returning();

      return toCartResponse(updatedCart, inserted);
    });
  }

  async delete(id: number): Promise<boolean> {
    const rows = await db
      .delete(carts)
      .where(eq(carts.id, id))
      .returning({ id: carts.id });
    return rows.length > 0;
  }
}

export const cartRepository = new CartRepository();
export default cartRepository;
