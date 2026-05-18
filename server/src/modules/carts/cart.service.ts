import {
  cartRepository,
  CartRepository,
  type CartResponse,
  type EnrichedCartResponse,
  type PaginatedCartResponse,
} from "./cart.repository";
import { BadRequestError, NotFoundError } from "../../core/errors";
import type { UpdateCartInput, CartItemInput } from "./validator";

export class CartService {
  constructor(private readonly carts: CartRepository = cartRepository) {}

  async listCarts(): Promise<CartResponse[]> {
    return this.carts.findAll();
  }

  async getCartById(id: number): Promise<CartResponse> {
    const cart = await this.carts.findById(id);
    if (!cart) throw new NotFoundError("Cart not found");
    return cart;
  }

  async getCartForUser(userId: number): Promise<CartResponse> {
    const cart = await this.carts.findByUserId(userId);
    if (!cart) throw new NotFoundError("Cart not found");
    return cart;
  }

  async getCartByUserIdPaginated(
    userId: number,
    skip: number = 0,
    limit: number = 10,
  ): Promise<PaginatedCartResponse> {
    const cart = await this.carts.findByUserIdEnriched(userId);
    if (!cart) throw new NotFoundError("Cart not found");

    const carts = [cart];
    const total = 1; // Since we're getting cart for a specific user, there's at most 1 cart

    return {
      carts,
      total,
      skip,
      limit,
    };
  }

  async createCart(userId: number): Promise<CartResponse> {
    return this.carts.create({ userId });
  }

  async updateCart(id: number, data: UpdateCartInput): Promise<CartResponse> {
    let cart = await this.carts.findById(id);
    if (!cart) throw new NotFoundError("Cart not found");

    if (data.items !== undefined) {
      const replaced = await this.carts.replaceItems(id, data.items);
      if (!replaced) throw new NotFoundError("Cart not found");
      cart = replaced;
    }

    return cart;
  }

  async addItem(id: number, item: CartItemInput): Promise<CartResponse> {
    const cart = await this.carts.findById(id);
    if (!cart) throw new NotFoundError("Cart not found");

    const merged = [...cart.products];
    const existingIdx = merged.findIndex((i) => i.productId === item.productId);
    const next =
      existingIdx >= 0
        ? merged.map((i, idx) =>
            idx === existingIdx
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )
        : [...merged, { ...item, id: 0 }];

    const replaced = await this.carts.replaceItems(
      id,
      next.map(({ productId, quantity, priceAtAdd }) => ({
        productId,
        quantity,
        priceAtAdd,
      })),
    );
    if (!replaced) throw new BadRequestError("Failed to update cart");
    return replaced;
  }

  async deleteCart(id: number): Promise<void> {
    const ok = await this.carts.delete(id);
    if (!ok) throw new NotFoundError("Cart not found");
  }
}

export const cartService = new CartService();
export default cartService;
