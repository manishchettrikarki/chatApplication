// chat.routes.ts
import { Router } from "express";
import { ChatService } from "./message.service";
import { ChatController } from "./message.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const chatRouter = Router();
const chatService = new ChatService();
const chatController = new ChatController(chatService);

chatRouter.get("/:userId", authMiddleware, chatController.getMessages);
chatRouter.post("/:userId", authMiddleware, chatController.sendMessage);

export { chatRouter };
