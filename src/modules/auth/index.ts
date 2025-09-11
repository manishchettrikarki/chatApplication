import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModel } from "../user/model/user.model";
import { UserProfileModel } from "../user/model/user.profile.model";

const authService = new AuthService(UserModel, UserProfileModel);
export const authController = new AuthController(authService);
