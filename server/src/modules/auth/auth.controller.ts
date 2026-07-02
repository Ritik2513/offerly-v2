import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { registerUserPrisma, loginUserPrisma } from "./auth.prisma.service.js";
import { generateToken } from "../../utils/jwt.js";
import { Request, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// register controller
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await registerUserPrisma(req.body);

    const token = generateToken(user.id, user.tenantId);

    res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json(new ApiResponse(201, { user }, "User registered"));
  },
);

// Login Controller
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await loginUserPrisma(req.body);

    const token = generateToken(user.id, user.tenantId);

    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json(new ApiResponse(200, { user }, "Login successful"));
  },
);

// ME
export const getMe = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .clearCookie("token", cookieOptions)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  },
);
