import prisma from "../../config/prisma.js";
import { nanoid } from "nanoid";
import ApiError from "../../utils/ApiError.js";

interface GenerateTrackingInput {
  offerId: string;
  affiliateId?: string;
  userId: string;
  role: string;
  tenantId: string;
}

export const generateTrackingLinkPrisma = async ({
  offerId,
  affiliateId,
  userId,
  role,
  tenantId,
}: GenerateTrackingInput) => {
  // Verify offer belongs to current tenant
  const offer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      tenantId,
    },
  });

  if (!offer) {
    throw new ApiError(404, "Offer not found in your workspace");
  }

  let affiliateUserId = userId;

  // Admin generates link for affiliate
  if (role === "admin") {
    if (!affiliateId) {
      throw new ApiError(400, "Affiliate is required");
    }

    const affiliate = await prisma.user.findFirst({
      where: {
        id: affiliateId,
        role: "affiliate",
        tenantId,
      },
    });

    if (!affiliate) {
      throw new ApiError(
        404,
        "Affiliate not found in your workspace",
      );
    }

    affiliateUserId = affiliate.id;
  }

  const slug = nanoid(8);

  return prisma.trackingLink.create({
    data: {
      slug,
      affiliateId: affiliateUserId,
      offerId,
      tenantId,
    },
  });
};