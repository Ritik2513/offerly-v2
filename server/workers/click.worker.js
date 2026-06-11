import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import redisConnection from "../config/redisQueue.js";
import mongoose from "mongoose";
import geoip from "geoip-lite";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UAParser = require("ua-parser-js");

import Click from "../modules/tracking/click.model.js";
import { incrementClickStats } from "../utils/analytics.helper.js";
import logger from "../config/logger.js";

await mongoose.connect(process.env.MONGO_URI);
logger.info("Worker MongoDB Connected");

//Worker listens to clickQueue
const worker = new Worker(
  "clickQueue",
  async (job) => {
    const {
      clickId,
      trackingLinkId,
      affiliate,
      offer,
      ip,
      userAgent,
      referer,
    } = job.data;

    logger.info("Processing click job:", trackingLinkId);

    // geo location
    const geo = geoip.lookup(ip);

    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";

    //device / browser parsing
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().type || "desktop";
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";

    const clickDoc = await Click.create({
      clickId,
      trackingLink: trackingLinkId,
      ip,
      country,
      city,
      device,
      browser,
      os,
      referer,
      affiliate,
      offer,
    });

    logger.info("Click saved to MongoDB", clickDoc);

    await incrementClickStats(clickDoc);
  },
  { connection: redisConnection },
);

worker.on("completed", (job) => {
  logger.info("Job Completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job Failed:", err);
});
