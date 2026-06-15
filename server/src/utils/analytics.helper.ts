import redisQueueConnection from "../config/redisQueue.js";

export const incrementClickStats = async (click: any): Promise<void> => {
  const date = new Date().toISOString().slice(0, 10);

  await redisQueueConnection.hincrby(`stats:click:${date}`, "total", 1);

  await redisQueueConnection.hincrby(`stats:offer:${click.offer}`, "clicks", 1);

  await redisQueueConnection.hincrby(
    `stats:affiliate:${click.affiliate}`,
    "clicks",
    1,
  );

  if (click.country) {
    await redisQueueConnection.hincrby(
      `stats:country:${click.country}`,
      "clicks",
      1,
    );
  }
};
