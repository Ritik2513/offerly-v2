import { Request, Response } from "express";
import { processPostbackPrisma } from "./postback.prisma.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

interface PostbackQuery {
  clickId?: string;
  amount?: string;
}

export const postbackConversion = asyncHandler(
  async (
    req: Request<{}, {}, {}, PostbackQuery>,
    res: Response,
  ): Promise<void> => {
    const { clickId, amount } = req.query;

    if (!clickId) {
      throw new ApiError(400, "Missing clickId");
    }

    const conversion = await processPostbackPrisma(
      clickId,
      amount ? Number(amount) : undefined,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, conversion, "Conversion processed successfully"),
      );
  },
);
