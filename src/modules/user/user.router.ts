import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { userController } from ".";
import validateBody from "../../utils/validators/validateReqBody";
import { updateUserSchema } from "./user.validation";
import { upload } from "../../middleware/upload";

export const userProfileRouter = Router();

userProfileRouter.get("/profile", authMiddleware, userController.getProfile);

userProfileRouter.patch(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  validateBody(updateUserSchema),
  userController.updateProfile
);
