import prisma from "../../config/prisma.js";

interface GetClicksInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tenantId: string;
}

interface CreateClickInput {
  clickId: string;
  trackingLinkId: string;
  affiliateId: string;
  offerId: string;
  tenantId: string;
  ip: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referer: string;
}

export const getClicksPrisma = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  tenantId,
}: GetClicksInput) => {
  const skip = (page - 1) * limit;

  const where = {
    tenantId,
    ...(search && {
      OR: [
        {
          clickId: {
            contains: search,
            mode: "insensitive" as const,
          },
        },

        {
          affiliate: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },

        {
          affiliate: {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },

        {
          offer: {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      ],
    }),

    ...(status === "converted" && {
      isConverted: true,
    }),

    ...(status === "pending" && {
      isConverted: false,
    }),
  };

  const totalItems = await prisma.click.count({
    where,
  });

  const clicks = await prisma.click.findMany({
    where,

    include: {
      affiliate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      offer: {
        select: {
          id: true,
          title: true,
        },
      },
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    clicks,

    pagination: {
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    },
  };
};

export const createClickPrisma = async ({
  clickId,
  trackingLinkId,
  affiliateId,
  offerId,
  tenantId,
  ip,
  country,
  city,
  device,
  browser,
  os,
  referer,
}: CreateClickInput) => {
  return prisma.click.create({
    data: {
      clickId,
      trackingLinkId,
      affiliateId,
      offerId,
      tenantId,
      ip,
      country,
      city,
      device,
      browser,
      os,
      referer,
    },
  });
};
