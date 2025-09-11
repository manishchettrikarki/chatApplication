import { Schema, model, Document } from "mongoose";

export interface IUserProfile {
  user: Schema.Types.ObjectId;
  bio?: string;
  phone?: string;
  avatar?: string;
  status?: "online" | "offline" | "busy";
  friends?: Schema.Types.ObjectId[];
}

export interface IUserProfileSchema extends IUserProfile, Document {}

export const userProfileSchema = new Schema<IUserProfileSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: String,
    phone: String,
    avatar: String,
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const UserProfileModel = model<IUserProfileSchema>(
  "UserProfile",
  userProfileSchema
);
