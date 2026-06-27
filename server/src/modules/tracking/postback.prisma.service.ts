import prisma from "../../config/prisma.js";

export const processPostbackPrisma = async (
  clickId: string,
  amount?: number,
) => {
  // find click

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
    throw new Error("Click not found");
  }

  // already converted

  if (click.isConverted) {
    throw new Error("Already converted");
  }

  const revenue = amount || click.offer.payout;

  const affiliatePayout = click.offer.payout;

  // transaction (important)

  return prisma.$transaction(async (tx) => {
    // create conversion

    const conversion = await tx.conversion.create({
      data: {
        clickId: click.id,
        trackingLinkId: click.trackingLinkId,
        affiliateId: click.affiliateId,
        offerId: click.offerId,

        revenue,
        payout: affiliatePayout,

        status: "approved",
        payoutStatus: "pending",
      },
    });

    // create payout

    await tx.payout.create({
      data: {
        affiliateId: click.affiliateId,
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

    // mark click converted

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