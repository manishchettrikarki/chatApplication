import mongoose from "mongoose";
import { SendMessageSchema } from "./message.validation";
import { IMessage } from "./model/message.schema";
import { MessageModel } from "./model/message.model";

export interface IMessageService {
  sendMessage(senderId: string, data: SendMessageSchema): Promise<IMessage>;
  getMessages(userId: string, otherUserId: string): Promise<IMessage[]>;
}

export class MessageService implements IMessageService {
  async sendMessage(senderId: string, data: SendMessageSchema) {
    const message = new MessageModel({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(data.receiverId),
      text: data.text,
    });
    await message.save();
    return message;
  }

  async getMessages(userId: string, otherUserId: string) {
    return MessageModel.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
  }
}
