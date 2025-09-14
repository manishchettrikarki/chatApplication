import { NextFunction, Request, Response } from "express";

//
import { IAuthService } from "./auth.service";

//
export class AuthController {
  #service: IAuthService;

  //
  constructor(service: IAuthService) {
    this.#service = service;
  }

  //
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

      const savedUser = await this.#service.register(body);

      const { password, ...userWithoutPassword } = savedUser;

      // Send formatted response
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  };

  //
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.#service.login(email, password);

      return res.json({
        success: true,
        message: "Login successful",
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  //
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      const token = await this.#service.refresh(refreshToken);

      return res.json({
        success: true,
        message: "Access token refreshed",
        ...token,
      });
    } catch (error) {
      next(error);
    }
  };

  //
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      const result = await this.#service.logout(refreshToken);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
