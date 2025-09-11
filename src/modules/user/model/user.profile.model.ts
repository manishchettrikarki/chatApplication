import mongoose, { Model } from "mongoose";
import {
  userProfileSchema,
  IUserProfileSchema as IUserProfileSchema,
} from "./user.profile.schema";

export type IUserProfileModel = Model<IUserProfileSchema>;

export const UserProfileModel: IUserProfileModel =
  mongoose.model<IUserProfileSchema>("UserProfile", userProfileSchema);
