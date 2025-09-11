import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { userProfileRouter } from "../modules/user/user.router";

export const appRouter = Router();

appRouter.use("/auth", authRouter);

appRouter.use("/user", userProfileRouter);
