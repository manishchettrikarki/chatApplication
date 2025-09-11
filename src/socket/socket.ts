import { Server as SocketServer, Socket } from "socket.io";
import { socketAuthenticate } from "./socket.auth";
import { MessageService } from "../modules/message/message.service";
import { UserProfileModel } from "../modules/user/model/user.profile.model";

//
const onlineUsers = new Map<string, Set<string>>();
const messageService = new MessageService();

export function initSocket(io: SocketServer) {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers["authorization"]?.toString().split(" ")[1];

    const user = socketAuthenticate(socket, token);
    if (!user) return next(new Error("Unauthorized"));

    socket.data.user = user;

    //
    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, new Set());
    }
    onlineUsers.get(user.id)?.add(socket.id);

    next();
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.email}`);

    // Update status to online in DB
    UserProfileModel.findOneAndUpdate(
      { user: user.id },
      { status: "online" },
      { new: true }
    ).catch((err) => console.error("Error updating status:", err));

    //private message
    socket.on("chat:private", async ({ to, text }) => {
      const senderId = user.id;
      const msg = await messageService.sendMessage(senderId, {
        receiverId: to,
        text,
      });

      // check if online
      const receiverSockets = onlineUsers.get(to);
      if (receiverSockets) {
        receiverSockets.forEach((socketId) =>
          io.to(socketId).emit("chat:private", msg)
        );
      }
      socket.emit("chat:private", msg);
    });

    //Disconnecting
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.email}`);

      // Remove this socket from user's set
      const userSockets = onlineUsers.get(user.id);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          // making user offilne
          onlineUsers.delete(user.id);

          UserProfileModel.findOneAndUpdate(
            { user: user.id },
            { status: "offline", lastActive: new Date() },
            { new: true }
          ).catch((err) => console.error("Error updating status:", err));
        }
      }
    });
  });
}
