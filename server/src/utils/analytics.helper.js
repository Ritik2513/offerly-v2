import redisQueueConnection from "../config/redisQueue.js";

//increment global counters
export const incrementClickStats = async (click) => {
  const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  //total clicks per day
  await redisQueueConnection.hincrby(`stats:click:${date}`, "total", 1);

  //clicks per offer
  await redisQueueConnection.hincrby(`stats:offer:${click.offer}`, "clicks", 1);

  //clicks per affiliate
  await redisQueueConnection.hincrby(
    `stats:affiliate:${click.affiliate}`,
    "clicks",
    1,
  );

  //clicks by country
  if (click.country) {
    await redisQueueConnection.hincrby(
      `stats:country:${click.country}`,
      "clicks",
      1,
    );
  }
};
