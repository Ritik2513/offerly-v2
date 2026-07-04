import prisma from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";

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

  return prisma.$transaction(async (tx) => {
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
};
