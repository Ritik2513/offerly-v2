import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

interface JwtPayload {
  id: string;
}

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

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = user;

    if (!user) {
      throw new ApiError(401, "User not found");
    }
    next();
  },
);
