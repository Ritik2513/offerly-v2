import prisma from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { getIO } from "../../socket/socket.server.js";
import { SOCKET_EVENTS } from "../../socket/events.js";

export const processPostbackPrisma = async (
  clickId: string,
  amount?: number,
) => {
  const click = await prisma.click.findUnique({
    where: {
      clickId,
    },

    include: {
      trackingLink: true,
      offer: true,
    },
  });

  if (!click) {
    throw new ApiError(404, "Click not found");
  }

  if (click.isConverted) {
    throw new ApiError(400, "Already converted");
  }

  const revenue = amount ?? click.offer.payout;
  const affiliatePayout = click.offer.payout;

  const result = await prisma.$transaction(async (tx) => {
    const conversion = await tx.conversion.create({
      data: {
        clickId: click.id,
        trackingLinkId: click.trackingLinkId,
        affiliateId: click.affiliateId,
        offerId: click.offerId,

        tenantId: click.tenantId,

        revenue,
        payout: affiliatePayout,

        status: "approved",
        payoutStatus: "pending",
      },
    });

    await tx.payout.create({
      data: {
        affiliateId: click.affiliateId,

        tenantId: click.tenantId,

        amount: affiliatePayout,

        conversions: {
          connect: [
            {
              id: conversion.id,
            },
          ],
        },

        status: "pending",
      },
    });

    await tx.click.update({
      where: {
        id: click.id,
      },

      data: {
        isConverted: true,
      },
    });

    return conversion;
  });

  const io = getIO();
  io.to(`tenant:${result.tenantId}`).emit(SOCKET_EVENTS.CONVERSION_CREATED, {
    id: result.id,
    affiliateId: result.affiliateId,
    offerId: result.offerId,
    revenue: result.revenue,
    payout: result.payout,
    status: result.status,
    createdAt: result.createdAt,
  });

  return result;
};
