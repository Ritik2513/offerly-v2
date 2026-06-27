import prisma from "../../config/prisma.js";

interface GetPayoutInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const createPayoutPrisma = async (affiliateId: string) => {
  const conversions = await prisma.conversion.findMany({
    where: {
      affiliateId,
      payout: {
        gt: 0,
      },
      payoutStatus: {
        not: "paid",
      },
    },
  });

  if (!conversions.length) {
    throw new Error("No payable conversions");
  }

  const totalAmount = conversions.reduce((acc, curr) => acc + curr.payout, 0);

  const payout = await prisma.payout.create({
    data: {
      affiliateId,
      amount: totalAmount,

      conversions: {
        connect: conversions.map((c) => ({
          id: c.id,
        })),
      },
    },
  });

  await prisma.conversion.updateMany({
    where: {
      id: {
        in: conversions.map((c) => c.id),
      },
    },

    data: {
      payoutStatus: "paid",
      payoutId: payout.id,
    },
  });

  return payout;
};

export const getPayoutPrisma = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetPayoutInput) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),

    ...(search && {
      affiliate: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },

          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    }),
  };

  const totalItems = await prisma.payout.count({ where });

  const payouts = await prisma.payout.findMany({
    where,

    include: {
      affiliate: true,
      conversions: true,
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    payouts,
    pagination: {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const markPayoutPaidPrisma = async (id: string) => {
  const payout = await prisma.payout.findUnique({
    where: {
      id,
    },
  });

  if (!payout) {
    throw new Error("Payout not found");
  }

  if (payout.status === "paid") {
    throw new Error("Already paid");
  }

  return prisma.payout.update({
    where: { id },

    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });
};
