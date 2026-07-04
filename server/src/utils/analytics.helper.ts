import redisQueueConnection from "../config/redisQueue.js";

interface ClickAnalyticsInput {
  tenantId: string;
  offerId: string;
  affiliateId: string;
  country?: string | null;
}

export const incrementClickStats = async ({
  tenantId,
  offerId,
  affiliateId,
  country,
}: ClickAnalyticsInput): Promise<void> => {
  const date = new Date().toISOString().slice(0, 10);

  // Today's clicks
  await redisQueueConnection.hincrby(
    `stats:${tenantId}:click:${date}`,
    "total",
    1,
  );

  // Offer clicks
  await redisQueueConnection.hincrby(
    `stats:${tenantId}:offer:${offerId}`,
    "clicks",
    1,
  );

  // Affiliate clicks
  await redisQueueConnection.hincrby(
    `stats:${tenantId}:affiliate:${affiliateId}`,
    "clicks",
    1,
  );

  // Country clicks
  if (country) {
    await redisQueueConnection.hincrby(
      `stats:${tenantId}:country:${country}`,
      "clicks",
      1,
    );
  }
};
