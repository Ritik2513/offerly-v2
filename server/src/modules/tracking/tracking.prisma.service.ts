import prisma from "../../config/prisma.js";
import { nanoid } from "nanoid";
import ApiError from "../../utils/ApiError.js";

interface GenerateTrackingInput {
  offerId: string;
  affiliateId?: string;
  userId: string;
  role: string;
}

export const generateTrackingLinkPrisma = async ({
  offerId,
  affiliateId,
  userId,
  role,
}: GenerateTrackingInput) => {
  const slug = nanoid(8);

  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  const link = await prisma.trackingLink.create({
    data: {
      slug,
      affiliateId: role === "admin" ? affiliateId! : userId,
      offerId,
    },
  });
  return link;
};
