import prisma from "../../config/prisma.js";

interface GetConversionsInput {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getConversionsPrisma = async ({
  tenantId,
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetConversionsInput) => {
  const skip = (page - 1) * limit;

  const where = {
    tenantId,
    ...(status && { status }),

    ...(search && {
      OR: [
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
  };

  const totalItems = await prisma.conversion.count({
    where,
  });

  const conversions = await prisma.conversion.findMany({
    where,

    include: {
      affiliate: true,
      offer: true,
      click: true,
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });

  //Analytics
  //grouped counts
  const groupedStatus = await prisma.conversion.groupBy({
    by: ["status"],
    where,
    _count: {
      status: true,
    },
  });

  const approvedRevenue = await prisma.conversion.aggregate({
    where: {
      ...where,
      status: "approved",
    },
    _sum: {
      revenue: true,
    },
  });

  let approved = 0;
  let pending = 0;
  let rejected = 0;

  groupedStatus.forEach((item) => {
    if (item.status === "approved") {
      approved = item._count.status;
    }

    if (item.status === "pending") {
      pending = item._count.status;
    }

    if (item.status === "rejected") {
      rejected = item._count.status;
    }
  });

  const analytics = {
    approved,
    pending,
    rejected,
    totalRevenue: approvedRevenue._sum.revenue || 0,
  };

  return {
    conversions,
    analytics,
    pagination: {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};
