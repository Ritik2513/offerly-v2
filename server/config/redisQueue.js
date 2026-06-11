// import IORedis from "ioredis";

// const redisQueueConnection = new IORedis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   maxRetriesPerRequest: null, // important for BullMQ
// });

// export default redisQueueConnection;

import IORedis from "ioredis";

const redisQueueConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // important for BullMQ queues
});

export default redisQueueConnection;
