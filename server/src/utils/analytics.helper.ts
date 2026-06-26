interface ClickAnalyticsInput {
  offerId: string;
  affiliateId: string;
  country?: string | null;
}

import redisQueueConnection from "../config/redisQueue.js";

export const incrementClickStats = async ({
  offerId,
  affiliateId,
  country,
}: ClickAnalyticsInput): Promise<void> => {
  const date = new Date().toISOString().slice(0, 10);

  // total clicks today
  await redisQueueConnection.hincrby(`stats:click:${date}`, "total", 1);

  // offer clicks
  await redisQueueConnection.hincrby(`stats:offer:${offerId}`, "clicks", 1);

  // affiliate clicks
  await redisQueueConnection.hincrby(
    `stats:affiliate:${affiliateId}`,
    "clicks",
    1,
  );

  // country clicks
  if (country) {
    await redisQueueConnection.hincrby(`stats:country:${country}`, "clicks", 1);
  }
};
