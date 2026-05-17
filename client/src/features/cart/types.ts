import { z } from 'zod';

export const CartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive(),
  priceAtAdd: z.number().positive(),
});

export const CartSchema = z.object({
  id: z.number(),
  userId: z.number(),
  items: z.array(CartItemSchema),
  totalAmount: z.number().min(0),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
