import "../config/env.js";

import { Job, Worker } from "bullmq";
import geoip from "geoip-lite";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const UAParser = require("ua-parser-js");

import redisConnection from "../config/redisQueue.js";
import redisPublisher from "../config/redisPublisher.js";
import { ClickJobPayload } from "../types/queue.types.js";

import { incrementClickStats } from "../utils/analytics.helper.js";
import logger from "../config/logger.js";

import { createClickPrisma } from "../modules/tracking/click.prisma.service.js";

//Worker listens to clickQueue
const worker = new Worker<ClickJobPayload>(
  "clickQueue",

  async (job: Job<ClickJobPayload>) => {
    const {
      clickId,
      trackingLinkId,
      affiliate,
      offer,
      tenantId,
      ip,
      userAgent,
      referer,
    } = job.data;

    logger.info(`Processing click: ${clickId}`);

    const geo = geoip.lookup(ip);

    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";

    const parser = new UAParser(userAgent);

    const device = parser.getDevice().type || "desktop";
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";

    const clickDoc = await createClickPrisma({
      clickId,
      trackingLinkId,
      affiliateId: affiliate,
      offerId: offer,
      tenantId,
      ip,
      country,
      city,
      device,
      browser,
      os,
      referer,
    });

    logger.info("Click saved");

    logger.info("Incrementing Redis analytics...");

    await incrementClickStats({
      tenantId: job.data.tenantId,
      offerId: clickDoc.offerId,
      affiliateId: clickDoc.affiliateId,
      country: clickDoc.country,
    });

    logger.info("Redis analytics updated");

    await redisPublisher.publish(
      "analytics-events",
      JSON.stringify({
        type: "CLICK_TRACKED",
        tenantId,
        click: clickDoc,
      }),
    );

    logger.info("Analytics event published");
  },

  {
    connection: redisConnection,
  },
);

worker.on("completed", (job) => {
  logger.info("Job Completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job Failed:", err);
});
