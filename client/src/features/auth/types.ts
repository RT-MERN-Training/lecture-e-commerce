import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.url().optional(),
  phone: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
