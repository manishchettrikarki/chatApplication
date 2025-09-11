import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { messageController } from ".";

export const messageRouter = Router();

// Send a message
messageRouter.post("/", authMiddleware, messageController.sendMessage);

// Get messages with another user
messageRouter.get(
  "/:userId",
  authMiddleware,
  messageController.getMessagesWithUser
);
