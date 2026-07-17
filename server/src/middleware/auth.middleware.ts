import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { JwtPayload } from "../types/express.types.js";
import prisma from "../config/prisma.js";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, "Not authorized, No token");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // attach tenant to request
    req.tenantId = decoded.tenantId;

    // verify user belongs to same tenant
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        tenantId: decoded.tenantId,
      },
      include: {
        tenant: {
          select: {
            id: true,
            companyName: true,
            slug: true,
          },
        },
      },
    });
    console.log(user)
    
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account disabled");
    }

    req.user = user;
    next();
  },
);

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }

    next();
  };
