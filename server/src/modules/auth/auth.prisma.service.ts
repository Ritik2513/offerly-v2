import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUserPrisma = async ({
  name,
  email,
  password,
  role,
}: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const tenant = await prisma.tenant.findFirst();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "affiliate",
      tenantId: tenant!.id,
    },
  });

  return user;
};

export const loginUserPrisma = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tenant: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account disabled");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }
  return user;
};
