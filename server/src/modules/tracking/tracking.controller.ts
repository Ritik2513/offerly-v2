import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";

import prisma from "../../config/prisma.js";
import logger from "../../config/logger.js";

import { clickQueue } from "../../queues/click.queue.js";
import { ClickJobPayload } from "../../types/queue.types.js";

import { generateTrackingLinkPrisma } from "./tracking.prisma.service.js";

interface TrackingParams {
  slug: string;
}

// =======================================
// Generate Tracking Link
// =======================================

export const generateTrackingLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { offerId, affiliateId } = req.body;

    const link = await generateTrackingLinkPrisma({
      offerId,
      affiliateId,
      userId: req.user!.id,
      role: req.user!.role,
      tenantId: req.tenantId!,
    });

    res.status(201).json({
      success: true,
      trackingUrl: `${process.env.SERVER_URL}/api/tracking/t/${link.slug}`,
    });
  },
);

// =======================================
// Track Click
// =======================================

export const trackClick = async (
  req: Request<TrackingParams>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const link = await prisma.trackingLink.findUnique({
      where: {
        slug,
      },
      include: {
        offer: true,
      },
    });

    if (!link) {
      res.status(404).send("Invalid tracking link");
      return;
    }

    const clickId = nanoid(12);

    const clickData: ClickJobPayload = {
      clickId,

      trackingLinkId: link.id,

      affiliate: link.affiliateId,

      offer: link.offerId,

      tenantId: link.tenantId,

      ip: req.ip || "",

      userAgent: req.headers["user-agent"],

      referer: req.headers.referer || "direct",

      timestamp: Date.now(),
    };

    await clickQueue.add("trackClick", clickData);

    const redirectUrl = new URL(link.offer.landingPageUrl);

    redirectUrl.searchParams.set("clickId", clickId);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    logger.error(error);

    res.status(500).send("Tracking Error");
  }
};
