import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export default function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Body validation error",
          details: Object.fromEntries(
            err.issues.map((issue) => [issue.path.join("."), issue.message])
          ),
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
