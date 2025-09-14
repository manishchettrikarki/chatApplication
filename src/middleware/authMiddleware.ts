import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

//
import { handleUnauthorizedError } from "../utils/responseHandler";
import { jwtSecrets } from "../utils/constants";

//
interface AuthRequest extends Request {
  user?: { id: string };
}

//
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  //
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleUnauthorizedError(res, "No authorization header found");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtSecrets.jwtSecret) as JwtPayload & {
      id: string;
    };

    if (!payload.id) {
      return handleUnauthorizedError(res, "User not found");
    }

    req.user = { id: payload.id };
    next();
  } catch (error) {
    return handleUnauthorizedError(res, "Unauthorized token");
  }
}
