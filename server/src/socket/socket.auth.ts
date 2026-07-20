import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

interface JwtPayload {
  id: string;
  tenantId: string;
}

export const authenticateSocket = async (socket: Socket) => {
  const cookie = socket.handshake.headers.cookie;

  if (!cookie) {
    throw new ApiError(404, "Unauthorized");
  }

  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    throw new ApiError(404, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      tenantId: decoded.tenantId,
    },
    include: {
      tenant: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Unauthorized");
  }

  return user;
};
