import prisma from "../../config/prisma.js";

interface GetConversionsInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getConversionsPrisma = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetConversionsInput) => {
  const skip = (page - 1) * limit;

  const where = {
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

  return {
    conversions,
    pagination: {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};
