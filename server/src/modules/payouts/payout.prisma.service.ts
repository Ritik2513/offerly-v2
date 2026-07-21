import prisma from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { getIO } from "../../socket/socket.server.js";
import { SOCKET_EVENTS } from "../../socket/events.js";

interface GetPayoutInput {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const createPayoutPrisma = async (
  affiliateId: string,
  tenantId: string,
) => {
  const conversions = await prisma.conversion.findMany({
    where: {
      affiliateId,
      tenantId,

      payout: {
        gt: 0,
      },

      payoutStatus: {
        not: "paid",
      },
    },
  });

  if (!conversions.length) {
    throw new ApiError(404, "No payable conversions");
  }

  const totalAmount = conversions.reduce((acc, curr) => acc + curr.payout, 0);

  const payout = await prisma.payout.create({
    data: {
      affiliateId,
      tenantId,
      amount: totalAmount,

      conversions: {
        connect: conversions.map((c) => ({
          id: c.id,
        })),
      },
    },
  });

  const io = getIO();
  io.to(`tenant:${tenantId}`).emit(SOCKET_EVENTS.PAYOUT_CREATED, payout);

  await prisma.conversion.updateMany({
    where: {
      tenantId,

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
  tenantId,
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetPayoutInput) => {
  const skip = (page - 1) * limit;

  const where = {
    tenantId,

    ...(status && {
      status,
    }),

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

  const totalItems = await prisma.payout.count({
    where,
  });

  const payouts = await prisma.payout.findMany({
    where,

    include: {
      affiliate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      conversions: {
        select: {
          id: true,
          revenue: true,
          payout: true,
        },
      },
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });

  const groupedStatus = await prisma.payout.groupBy({
    by: ["status"],

    where,

    _count: {
      status: true,
    },

    _sum: {
      amount: true,
    },
  });

  let totalPaid = 0;
  let totalPending = 0;
  let totalPayouts = 0;

  groupedStatus.forEach((item) => {
    totalPayouts += item._count.status;

    if (item.status === "paid") {
      totalPaid = item._sum.amount ?? 0;
    }

    if (item.status === "pending") {
      totalPending = item._sum.amount ?? 0;
    }
  });

  const uniqueAffiliateData = await prisma.payout.findMany({
    where,

    distinct: ["affiliateId"],

    select: {
      affiliateId: true,
    },
  });

  const uniqueAffiliates = uniqueAffiliateData.length;

  return {
    payouts,

    analytics: {
      totalPaid,
      totalPending,
      totalPayouts,
      uniqueAffiliates,
    },

    pagination: {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const markPayoutPaidPrisma = async (id: string, tenantId: string) => {
  const payout = await prisma.payout.findFirst({
    where: {
      id,
      tenantId,
    },
  });

  if (!payout) {
    throw new ApiError(404, "Payout not found");
  }

  if (payout.status === "paid") {
    throw new ApiError(400, "Already paid");
  }

  const updated = await prisma.payout.update({
    where: {
      id,
    },

    data: {
      status: "paid",
      paidAt: new Date(),
    },
  });

  const io = getIO();
  io.to(`tenant:${tenantId}`).emit(SOCKET_EVENTS.PAYOUT_UPDATED, updated);

  return updated;
};
