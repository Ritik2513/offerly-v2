import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

startServer();
