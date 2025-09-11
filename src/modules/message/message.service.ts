// chat.service.ts

import { IMessage, MessageModel } from "./model/message.model";

export interface IChatService {
  sendMessage(
    senderId: string,
    receiverId: string,
    text: string
  ): Promise<IMessage>;
  getMessages(currentUserId: string, otherUserId: string): Promise<IMessage[]>;
}

export class ChatService implements IChatService {
  async sendMessage(senderId: string, receiverId: string, text: string) {
    const msg = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      text,
    });
    return msg.populate("sender receiver", "username email fullName");
  }

  async getMessages(currentUserId: string, otherUserId: string) {
    return MessageModel.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender receiver", "username email fullName");
  }
}
