import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserProfileModel } from "./model/user.profile.model";
import { UserModel } from "./model/user.model";

//
export const userService = new UserService(UserProfileModel, UserModel);
export const userController = new UserController(userService);
