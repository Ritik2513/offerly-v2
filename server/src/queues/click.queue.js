import { Queue } from "bullmq";
import redisQueueConnection from "../config/redisQueue.js";

export const clickQueue = new Queue("clickQueue", {
  connection: redisQueueConnection,
});
