import { Schema, model, Document } from "mongoose";

export interface IRegisterUser {
  email: string;
  fullName: string;
  username: string;
  password: string;
  refreshTokens?: string[];
}

export interface IRegisterUserSchema extends IRegisterUser, Document {}

export const userSchema = new Schema<IRegisterUserSchema>({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: [{ type: String }],
});

export const UserModel = model<IRegisterUserSchema>("User", userSchema);
