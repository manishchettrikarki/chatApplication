import mongoose, { Model } from "mongoose";
import { userSchema, IRegisterUserSchema } from "./user.schema";

// Generic model type
export type IUserModel = Model<IRegisterUserSchema>;

// Mongoose model
export const UserModel: IUserModel = mongoose.model<IRegisterUserSchema>(
  "User",
  userSchema
);
