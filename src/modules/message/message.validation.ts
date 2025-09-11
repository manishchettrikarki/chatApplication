import { z } from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  text: z.string().min(1).max(500),
});

export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
