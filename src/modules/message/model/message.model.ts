import mongoose, { Model } from "mongoose";
import { IMessageSchema, messageSchema } from "./message.schema";

export type IMessageModel = Model<IMessageSchema>;

export const MessageModel: IMessageModel = mongoose.model<IMessageSchema>(
  "Message",
  messageSchema
);
