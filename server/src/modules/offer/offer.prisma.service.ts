import prisma from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";

interface CreateOfferInput {
  title: string;
  category: string;
  description?: string;
  landingPageUrl: string;
  payout: number;
  status?: string;
}

interface GetOfferInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

//create offer
export const createOfferPrisma = async (data: CreateOfferInput) => {
  return await prisma.offer.create({
    data: {
      ...data,
      status: data.status || "active",
    },
  });
};

//get all offers
export const getOffersPrisma = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetOfferInput) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),

    ...(status && {
      status,
    }),
  };

  const totalOffers = await prisma.offer.count({
    where,
  });

  const offers = await prisma.offer.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    offers,
    pagination: {
      page,
      limit,
      totalOffers,
      totalPages: Math.ceil(totalOffers / limit),
    },
  };
};

// Get Single Offer
export const getOfferPrisma = async (id: string) => {
  const offer = await prisma.offer.findUnique({
    where: { id },
  });

  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return offer;
};

//update offer
export const updateOfferPrisma = async (
  id: string,
  data: Partial<CreateOfferInput>,
) => {
  const existing = await prisma.offer.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ApiError(404, "Offer not found");
  }

  return await prisma.offer.update({
    where: { id },
    data,
  });
};

//Delete offer
export const deleteOfferPrisma = async (id: string) => {
  const existing = await prisma.offer.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ApiError(404, "Offer not found");
  }

  await prisma.offer.delete({
    where: { id },
  });
  return true;
};
