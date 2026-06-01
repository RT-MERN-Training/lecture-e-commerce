import { z } from "zod";

// GET /users/:id, PATCH /users/:id — URL param (integer id).
export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserSchema = z
  .object({
    username: z.string().min(3).max(64).optional(),
    email: z.email().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    // `image` matches DummyJSON's avatar field name.
    image: z.url().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Provide at least one field to update",
  });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]).optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});
