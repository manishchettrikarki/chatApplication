// socket.ts
import { Server as SocketServer, Socket } from "socket.io";
import { socketAuthenticate } from "./socket.auth";
import { ChatService } from "../modules/message/message.service";

const onlineUsers = new Map<string, string>();
const chatService = new ChatService();

export function initSocket(io: SocketServer) {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers["authorization"]?.toString().split(" ")[1];

    const user = socketAuthenticate(socket, token);
    if (!user) return next(new Error("Unauthorized"));

    socket.data.user = user;
    onlineUsers.set(user.id, socket.id);
    next();
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.data.user.email}`);

    // private messaging
    socket.on("chat:private", async ({ to, text }) => {
      const senderId = socket.data.user.id;

      // persist to DB
      const msg = await chatService.sendMessage(senderId, to, text);

      // send to receiver if online
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("chat:private", msg);
      }

      // echo to sender
      socket.emit("chat:private", msg);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.user.email}`);
      onlineUsers.delete(socket.data.user.id);
    });
  });
}
