import mongoose, { Model } from "mongoose";
import { userSchema, IRegisterUserSchema } from "./user.schema";

export type IUserModel = Model<IRegisterUserSchema>;

export const UserModel: IUserModel = mongoose.model<IRegisterUserSchema>(
  "User",
  userSchema
);
