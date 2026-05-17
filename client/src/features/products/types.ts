import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().int().min(0),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.url(),
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
