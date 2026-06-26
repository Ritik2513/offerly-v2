import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { getClicksPrisma } from "./click.prisma.service.js";

interface ClickQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

export const getClicks = asyncHandler(
  async (
    req: Request<{}, {}, {}, ClickQuery>,
    res: Response,
  ): Promise<void> => {
    const result = await getClicksPrisma({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 10,

      search: req.query.search,

      status: req.query.status,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Clicks fetched successfully"));
  },
);
