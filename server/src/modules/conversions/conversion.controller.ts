import { Request, Response } from "express";
import { exportCSV } from "../../utils/csvExport.js";
import { getConversionsPrisma } from "./conversion.prisma.service.js";
import prisma from "../../config/prisma.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

// GET conversions
export const getConversions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await getConversionsPrisma({
      tenantId: req.tenantId!,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: req.query.status as string,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, "Conversions fetched successfully"));
  },
);

// EXPORT CSV
export const exportConversions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const conversions = await prisma.conversion.findMany({
      where: {
        tenantId: req.tenantId!,
      },
      include: {
        affiliate: {
          select: {
            name: true,
          },
        },
        offer: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = conversions.map((item) => ({
      affiliate: item.affiliate.name,
      offer: item.offer.title,
      revenue: item.revenue,
      payout: item.payout,
      status: item.status,
      date: item.createdAt.toLocaleDateString("en-IN"),
    }));

    exportCSV(
      res,
      data,
      ["affiliate", "offer", "revenue", "payout", "status", "date"],
      "conversions",
    );
  },
);
