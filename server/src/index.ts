import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectRedis } from "./config/redis.js";
import logger from "./config/logger.js";
import { initializeSocket } from "./socket/socket.server.js";

const PORT: number = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

const startServer = async () => {
  await connectRedis();

  initializeSocket(server);

  server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

startServer();
