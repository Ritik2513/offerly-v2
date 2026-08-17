import "./env.js";
import IORedis from "ioredis";

const redisSubscriber = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  enableReadyCheck: false,
});

redisSubscriber.on("connect", () => {
  console.log("🔌 Redis Subscriber connected");
});

redisSubscriber.on("ready", () => {
  console.log("✅ Redis Subscriber ready");
});

redisSubscriber.on("error", (error) => {
  console.error("❌ Redis Subscriber error:", error);
});

export default redisSubscriber;