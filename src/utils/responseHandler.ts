import { Response } from "express";

//
type ErrorType = (res: Response, message: string) => Response;

// Global Error handler for all
export const globalErrorHandler = (
  res: Response,
  statusCode: number = 500,
  message: string = "Something went wrong"
) => {
  return res.status(statusCode).json({ success: false, message });
};

// 401 Unauthorized Error
export const handleUnauthorizedError: ErrorType = (res, message) => {
  return globalErrorHandler(res, 401, message);
};

// 404 Not found
export const handleNotFound: ErrorType = (res, message) => {
  return globalErrorHandler(res, 404, message);
};

//
