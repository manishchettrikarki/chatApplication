import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { initSocket } from "./socket/socket";
import { appConfig } from "./utils/constants";
import { dbConnect } from "./configs/dbConnect";
import { app } from "./configs/appSetup";

async function startServer() {
  try {
    // HTTP server
    const httpServer = createServer(app);

    // Socket setup
    initSocket(httpServer);

    // Start server
    httpServer.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
    });

    // Connect DB
    await dbConnect();
  } catch (error) {
    console.error("Server start error:", error);
  }
}

startServer();
