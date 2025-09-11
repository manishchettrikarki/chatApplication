import { Response, NextFunction } from "express";
import { IMessageService } from "./message.service";
import { SendMessageSchema } from "./message.validation";
import { AuthenticatedRequest } from "../../types/authenticated.type";

export class MessageController {
  #service: IMessageService;

  constructor(service: IMessageService) {
    this.#service = service;
  }

  sendMessage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const senderId = req?.user?.id as string;
      const data: SendMessageSchema = req.body;

      const message = await this.#service.sendMessage(senderId, data);

      return res.json({ success: true, message });
    } catch (error) {
      next(error);
    }
  };

  getMessagesWithUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req?.user?.id as string;
      const otherUserId = req.params.userId;

      const messages = await this.#service.getMessages(userId, otherUserId);
      return res.json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  };
}
