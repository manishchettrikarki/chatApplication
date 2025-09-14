import { Server as SocketServer, Socket } from "socket.io";
import { socketAuthenticate } from "./socket.auth";
import { MessageService } from "../modules/message/message.service";
import { UserProfileModel } from "../modules/user/model/user.profile.model";

const onlineUsers = new Map<string, Set<string>>();
const messageService = new MessageService();

export function initSocket(httpServer: any) {
  const io = new SocketServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers["authorization"]?.toString().split(" ")[1];

    const user = socketAuthenticate(socket, token);
    if (!user) return next(new Error("Unauthorized"));

    socket.data.user = user;

    if (!onlineUsers.has(user.id)) onlineUsers.set(user.id, new Set());
    onlineUsers.get(user.id)?.add(socket.id);

    next();
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.email}`);

    // Update DB
    UserProfileModel.findOneAndUpdate(
      { user: user.id },
      { status: "online" },
      { new: true }
    ).catch(console.error);

    socket.on("chat:private", async ({ to, text }) => {
      const msg = await messageService.sendMessage(user.id, {
        receiverId: to,
        text,
      });

      // emit to receiver if online
      onlineUsers
        .get(to)
        ?.forEach((socketId) => io.to(socketId).emit("chat:private", msg));

      // emit to sender
      socket.emit("chat:private", msg);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.email}`);
      const userSockets = onlineUsers.get(user.id);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(user.id);
          UserProfileModel.findOneAndUpdate(
            { user: user.id },
            { status: "offline", lastActive: new Date() },
            { new: true }
          ).catch(console.error);
        }
      }
    });
  });

  return io;
}
