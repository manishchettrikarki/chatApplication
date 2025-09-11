import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { userProfileRouter } from "../modules/user/user.router";
import { messageRouter } from "../modules/message/message.router";

export const appRouter = Router();

appRouter.use("/auth", authRouter);

appRouter.use("/user", userProfileRouter);

appRouter.use("/messages", messageRouter);
