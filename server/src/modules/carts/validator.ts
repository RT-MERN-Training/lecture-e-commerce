import { z } from "zod";

const priceSchema = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "string" ? Number(v) : v))
  .refine(
    (v) => Number.isFinite(v) && v >= 0 && Math.round(v * 100) / 100 === v,
    { message: "Price must be a positive number with up to 2 decimals" },
  );

// POST /carts — create a cart for a user (integer userId).
export const createCartSchema = z.object({
  userId: z.number().int().positive(),
});
export type CreateCartInput = z.infer<typeof createCartSchema>;

// Shape of a single cart line item (integer productId).
export const cartItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  priceAtAdd: priceSchema,
});
export type CartItemInput = z.infer<typeof cartItemInputSchema>;

// POST /carts/:id/items — add a single item.
export const addCartItemSchema = cartItemInputSchema;

// PATCH /carts/:id — replace items wholesale.
export const updateCartSchema = z
  .object({
    items: z.array(cartItemInputSchema).optional(),
  })
  .refine((obj) => obj.items !== undefined, {
    message: "Provide items",
  });
export type UpdateCartInput = z.infer<typeof updateCartSchema>;

// Integer id param.
export const cartIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /carts?userId= query param.
export const cartQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
});

// GET /carts/users/:userId param.
export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

// Pagination query params.
export const paginationQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().positive().default(10),
});
