import { Request, Response, NextFunction } from "express";
import { IUserService } from "./user.service";
import { AuthenticatedRequest } from "../../types/authenticated.type";

//
export class UserController {
  #service: IUserService;

  //
  constructor(service: IUserService) {
    this.#service = service;
  }

  //update user profile
  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req?.user?.id;
      if (!userId) throw "No user found";

      const data = req.body as any;

      if (req.file) {
        data.avatar = `/uploads/${req.file.filename}`; // store relative URL
      }

      const updatedProfile = await this.#service.updateProfile(userId, data);

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /profile
  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req?.user?.id;

      console.log(userId);

      //
      if (!userId) {
        throw "No user found";
      }
      const profile = await this.#service.getProfile(userId);

      if (!profile)
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });

      return res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };
}
