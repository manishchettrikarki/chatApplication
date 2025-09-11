import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

/**
 *
 */
export function socketAuthenticate(socket: Socket, token?: string) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    socket.data.user = payload;
    return payload;
  } catch {
    return null;
  }
}
