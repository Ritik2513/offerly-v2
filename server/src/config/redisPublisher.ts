import "./env.js";
import IORedis from "ioredis";

const redisPublisher = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  enableReadyCheck: false,
});

redisPublisher.on("connect", () => {
  console.log("🔌 Redis Publisher connected");
});

redisPublisher.on("ready", () => {
  console.log("✅ Redis Publisher ready");
});

redisPublisher.on("error", (error) => {
  console.error("❌ Redis Publisher error:", error);
});

export default redisPublisher;