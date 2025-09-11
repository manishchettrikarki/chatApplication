import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";

export const messageService = new MessageService();
export const messageController = new MessageController(messageService);
