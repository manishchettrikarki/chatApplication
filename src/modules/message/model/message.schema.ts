import { Schema, Document, model } from "mongoose";

export interface IMessage {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IMessageSchema extends IMessage, Document {}

export const messageSchema = new Schema<IMessageSchema>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
