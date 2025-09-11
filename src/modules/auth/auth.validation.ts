import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  username: z.string({ message: "Username is required" }),
  fullName: z.string({ message: "Full name is required" }),
  password: z.string({ message: "Password is required" }),
});
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

//
export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginUserSchema = z.infer<typeof loginUserSchema>;

//
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

//
export const logoutSchema = z.object({
  refreshToken: z.string({ message: "Refresh token is required" }),
});
export type LogoutSchema = z.infer<typeof logoutSchema>;
