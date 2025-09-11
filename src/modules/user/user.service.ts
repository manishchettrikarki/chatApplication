import { UpdateUserSchema } from "./user.validation";
import { IUserProfileModel } from "./model/user.profile.model";
import { IUserProfileSchema } from "./model/user.profile.schema";
import { IUserModel } from "./model/user.model";

//
export interface IUserService {
  updateProfile(
    userId: string,
    data: UpdateUserSchema
  ): Promise<IUserProfileSchema | null>;

  getProfile(userId: string): Promise<IUserProfileSchema | null>;
}
//
export class UserService implements IUserService {
  #profileModel: IUserProfileModel;
  #userModel: IUserModel;

  constructor(profileModel: IUserProfileModel, userModel: IUserModel) {
    this.#profileModel = profileModel;
    this.#userModel = userModel;
  }

  async updateProfile(
    userId: string,
    data: UpdateUserSchema & { avatar?: string }
  ) {
    const updatedProfile = await this.#profileModel
      .findOneAndUpdate(
        { user: userId },
        { $set: data },
        { new: true, upsert: true }
      )
      .populate("user", "username fullName email");

    if (!updatedProfile) throw new Error("Profile not found");
    return updatedProfile;
  }

  async getProfile(userId: string) {
    return this.#profileModel
      .findOne({ user: userId })
      .populate("user", "username fullName email");
  }
}
