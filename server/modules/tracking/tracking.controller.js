import { nanoid } from "nanoid";
import geoip from "geoip-lite";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const UAParser = require("ua-parser-js");

import TrackingLink from "./trackingLink.model.js";
import Click from "./click.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import logger from "../../config/logger.js";
import { incrementClickStats } from "../../utils/analytics.helper.js";

// Generate tracking link
export const generateTrackingLink = asyncHandler(async (req, res) => {
  const { offerId, affiliateId } = req.body;

  const slug = nanoid(8);

  const link = await TrackingLink.create({
    slug,
    affiliate: req.user.role === "admin" ? affiliateId : req.user._id,
    offer: offerId,
  });

  res.status(201).json({
    message: "Tracking link created",
    trackingUrl: `${process.env.SERVER_URL}/api/tracking/t/${slug}`,
  });
});

// Track click
export const trackClick = async (req, res) => {
  try {
    const { slug } = req.params;

    const link = await TrackingLink.findOne({ slug }).populate("offer");

    if (!link) {
      return res.status(404).send("Invalid tracking link");
    }

    const clickId = nanoid(12);

    // Geo Location
    const geo = geoip.lookup(req.ip);

    const country = geo?.country || "Unknown";
    const city = geo?.city || "Unknown";

    // Device Detection
    const parser = new UAParser(req.headers["user-agent"]);

    const device = parser.getDevice().type || "desktop";
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";

    // Save Click Directly
    const clickDoc = await Click.create({
      clickId,
      trackingLink: link._id,
      affiliate: link.affiliate,
      offer: link.offer._id,

      ip: req.ip,
      country,
      city,

      device,
      browser,
      os,

      referer: req.headers.referer || "direct",
    });

    // Update Redis Analytics
    await incrementClickStats(clickDoc);

    logger.info(`Click tracked: ${clickId}`);

    // Redirect with clickId
    const redirectUrl = new URL(link.offer.landingPageUrl);

    redirectUrl.searchParams.set("clickId", clickId);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    logger.error(error);
    return res.status(500).send("Tracking Error");
  }
};
