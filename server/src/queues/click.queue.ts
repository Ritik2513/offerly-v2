import { Queue } from "bullmq";
import redisQueueConnection from "../config/redisQueue.js";
import { ClickJobPayload } from "../types/queue.types.js";

export const clickQueue = new Queue<ClickJobPayload>("clickQueue", {
  connection: redisQueueConnection,
});
