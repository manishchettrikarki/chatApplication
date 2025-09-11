import { Router } from "express";
import { authController } from ".";
import validateBody from "../../utils/validators/validateReqBody";
import {
  loginUserSchema,
  logoutSchema,
  refreshTokenSchema,
  registerUserSchema,
} from "./auth.validation";
import { authMiddleware } from "../../middleware/authMiddleware";

export const authRouter = Router();

//register user route
authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  authController.register
);

//
authRouter.post("/login", validateBody(loginUserSchema), authController.login);

//
authRouter.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  authMiddleware,
  authController.refresh
);

//
authRouter.post("/logout", validateBody(logoutSchema), authController.logout);
