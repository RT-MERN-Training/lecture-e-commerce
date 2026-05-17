import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  discountPercentage: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  stock: z.number().int().min(0).optional(),
  // brand is optional — matches DummyJSON where some products omit brand.
  brand: z.string().min(1).max(100).optional().nullable(),
  category: z.string().min(1).max(100),
  thumbnail: z.url(),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Integer id param (serial PK).
export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// GET /products query params — matches DummyJSON query API.
export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().min(0).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});
