import dotenv from "dotenv";
dotenv.config();

import { Job, Worker } from "bullmq";
import mongoose from "mongoose";
import geoip from "geoip-lite";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const UAParser = require("ua-parser-js");

import redisConnection from "../config/redisQueue.js";
import { ClickJobPayload } from "../types/queue.types.js";

import Click from "../modules/tracking/click.model.js";
import { incrementClickStats } from "../utils/analytics.helper.js";
import logger from "../config/logger.js";

await mongoose.connect(process.env.MONGO_URI as string);
logger.info("Worker MongoDB Connected");

//Worker listens to clickQueue
const worker = new Worker<ClickJobPayload>(
  "clickQueue",

  async (job: Job<ClickJobPayload>) => {
    const {
      clickId,
      trackingLinkId,
      affiliate,
      offer,
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

    const clickDoc = await Click.create({
      clickId,

      trackingLink: trackingLinkId,

      affiliate,

      offer,

      ip,

      country,

      city,

      device,

      browser,

      os,

      referer,
    });

    logger.info("Click saved");

    await incrementClickStats(clickDoc);
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
