import { z } from "zod";

export const updateUserSchema = z.object({
  bio: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  status: z.enum(["online", "offline", "busy"]).optional(),
  friends: z.array(z.string()).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
