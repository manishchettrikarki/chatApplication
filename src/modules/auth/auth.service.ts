import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserModel } from "./../user/model/user.model";
import { RefreshTokenSchema, RegisterUserSchema } from "./auth.validation";
import { IUserProfileModel } from "../user/model/user.profile.model";
import { jwtSecrets } from "../../utils/constants";

//
export interface IAuthService {
  register(data: RegisterUserSchema): Promise<RegisterUserSchema>;
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  refresh(
    data: RefreshTokenSchema["refreshToken"]
  ): Promise<{ accessToken: string }>;
  logout(refreshToken: string): Promise<{ success: boolean; message: string }>;
}

//
export class AuthService implements IAuthService {
  #userModel: IUserModel;
  #userProfileModel: IUserProfileModel;

  constructor(userModel: IUserModel, userProfileModel: IUserProfileModel) {
    this.#userModel = userModel;
    this.#userProfileModel = userProfileModel;
  }

  //
  async register(data: Partial<RegisterUserSchema>) {
    try {
      // Check if user already exists
      const existingUser = await this.#userModel.findOne({ email: data.email });
      if (existingUser) throw new Error("User already exists");

      //Hash password
      if (data.password) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
      }

      //Create the User
      const user = new this.#userModel(data);
      const savedUser = await user.save();

      //Create the UserProfile linked to this user
      await this.#userProfileModel.create({
        user: savedUser._id,
      });

      //Return the user object
      return savedUser.toObject();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //
  async login(email: string, password: string) {
    const user = await this.#userModel.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecrets.jwtSecret as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      jwtSecrets.jwtRefreshSecret as string,
      { expiresIn: "7d" }
    );

    // Save refresh token to user document
    await this.#userModel.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: refreshToken } }
    );

    return { accessToken, refreshToken };
  }

  //
  async refresh(refreshToken: string) {
    try {
      const JWT_SECRET = jwtSecrets.jwtSecret as string;
      const JWT_REFRESH_SECRET = jwtSecrets.jwtRefreshSecret as string;

      // verify refresh token
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        id: string;
      };

      // ensure user still exists
      const user = await this.#userModel.findById(payload.id);
      if (!user) throw new Error("User not found");

      // issue new access token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  //
  async logout(refreshToken: string) {
    try {
      if (!refreshToken) throw new Error("Refresh token required");

      const result = await this.#userModel.updateOne(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Invalid refresh token or already logged out");
      }

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
