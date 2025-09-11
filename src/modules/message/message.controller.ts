// chat.controller.ts
import { Request, Response } from "express";
import { IChatService } from "./message.service";

export class ChatController {
  #service: IChatService;

  constructor(service: IChatService) {
    this.#service = service;
  }

  //
  getMessages = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const messages = await this.#service.getMessages(currentUserId, userId);
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  //
  sendMessage = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { text } = req.body;
      const currentUserId = req.user.id;

      const message = await this.#service.sendMessage(
        currentUserId,
        userId,
        text
      );
      res.status(201).json(message);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
}
