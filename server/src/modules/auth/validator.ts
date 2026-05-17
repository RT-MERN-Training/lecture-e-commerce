import { z } from "zod";

// POST /auth/signup body
export const signupSchema = z.object({
  username: z.string().min(3).max(64),
  email: z.email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  // `image` matches DummyJSON avatar field name.
  image: z.url().optional(),
  role: z.enum(["admin", "customer"]).optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

// POST /auth/login body — DummyJSON uses username (not email) for login.
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// POST /auth/forget-password body
export const forgetPasswordSchema = z.object({
  email: z.email(),
});
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;

// POST /auth/reset-password body
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// POST /auth/refresh body
export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshInput = z.infer<typeof refreshSchema>;
