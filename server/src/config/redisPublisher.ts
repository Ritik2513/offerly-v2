import "./env.js";
import IORedis from "ioredis";

const redisPublisher = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});


export default redisPublisher;
