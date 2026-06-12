import { createClient } from "redis";
import logger from "./logger.js";

export const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisClient.on("error", (err) => logger.error("Redis Error", err));

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
  logger.info("Redis connected");
};
