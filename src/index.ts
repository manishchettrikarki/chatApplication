import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

import { app } from "./configs/appSetup";
import { appConfig } from "./utils/constants";
import { initSocket } from "./socket/socket";
import { dbConnect } from "./configs/dbConnect";

const port = appConfig.port;

async function startServer() {
  try {
    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.IO
    const io = new SocketServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initialize socket logic
    initSocket(io);

    // Start server
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Connect to DB
    await dbConnect();
  } catch (error) {
    console.error(error);
  }
}

startServer();
