import { Request, Response } from "express";
import { nanoid } from "nanoid";

import TrackingLink from "./trackingLink.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { clickQueue } from "../../queues/click.queue.js";
import logger from "../../config/logger.js";
import { ClickJobPayload } from "../../types/queue.types.js";

// Generate tracking link
export const generateTrackingLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { offerId, affiliateId } = req.body;

    const slug = nanoid(8);

    const link = await TrackingLink.create({
      slug,
      affiliate: req.user?.role === "admin" ? affiliateId : req.user?._id,
      offer: offerId,
    });

    res.status(201).json({
      message: "Tracking link created",
      trackingUrl: `${process.env.SERVER_URL}/api/tracking/t/${slug}`,
    });
  },
);

// Track click
export const trackClick = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const link = await TrackingLink.findOne({ slug }).populate("offer");

    if (!link) {
      res.status(404).send("Invalid tracking link");
      return;
    }

    const clickId = nanoid(12);

    const populatedOffer = link.offer as any;

    const clickData: ClickJobPayload = {
      clickId,
      trackingLinkId: link._id.toString(),
      affiliate: link.affiliate.toString(),
      offer: populatedOffer._id.toString(),
      ip: req.ip || "",
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer || "direct",
      timestamp: Date.now(),
    };

    await clickQueue.add("trackClick", clickData);

    const redirectUrl = new URL(populatedOffer.landingPageUrl);

    redirectUrl.searchParams.set("clickId", clickId);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    logger.error(error);

    res.status(500).send("Tracking Error");
  }
};
