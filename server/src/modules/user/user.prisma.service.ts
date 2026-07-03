import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

interface GetAffiliateInput {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const createAffiliatePrisma = async (
  name: string,
  email: string,
  password: string,
  tenantId: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "affiliate",
      tenantId,
    },
  });
};

export const getAffiliatesPrisma = async (tenantId: string) => {
  return prisma.user.findMany({
    where: {
      role: "affiliate",
      tenantId,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const getAllAffiliatesPrisma = async ({
  tenantId,
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetAffiliateInput) => {
  const skip = (page - 1) * limit;

  const where = {
    role: "affiliate",
    tenantId,

    ...(search && {
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
    }),

    ...(status !== undefined &&
      status !== "" && {
        isActive: status === "true",
      }),
  };

  const totalItems = await prisma.user.count({
    where,
  });

  const users = await prisma.user.findMany({
    where,

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });

  return {
    users,

    pagination: {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const toggleAffiliateStatusPrisma = async (
  id: string,
  tenantId: string,
) => {
  const user = await prisma.user.findFirst({
    where: { id, tenantId, role: "affiliate" },
  });

  if (!user) {
    throw new Error("Affiliate not found");
  }

  return prisma.user.update({
    where: { id },

    data: {
      isActive: !user.isActive,
    },
  });
};
