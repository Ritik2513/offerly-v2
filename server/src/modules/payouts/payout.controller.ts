import { Request, Response } from "express";
import prisma from "../../config/prisma.js";
import { exportCSV } from "../../utils/csvExport.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import {
  createPayoutPrisma,
  getPayoutPrisma,
  markPayoutPaidPrisma,
} from "./payout.prisma.service.js";

interface PayoutParams {
  id: string;
}

/*
=================================
CREATE PAYOUT
=================================
*/
export const createPayout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { affiliateId } = req.body;

    const payout = await createPayoutPrisma(affiliateId, req.tenantId!);

    res
      .status(201)
      .json(new ApiResponse(201, payout, "Payout created successfully"));
  },
);

/*
=================================
GET PAYOUTS
=================================
*/
export const getPayout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await getPayoutPrisma({
      tenantId: req.tenantId!,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: (req.query.search as string) || "",
      status: (req.query.status as string) || "",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          payouts: result.payouts,
          analytics: result.analytics,
          pagination: result.pagination,
        },
        "Payouts fetched successfully",
      ),
    );
  },
);

/*
=================================
MARK PAID
=================================
*/
export const markPayoutPaid = async (
  req: Request<PayoutParams>,
  res: Response,
): Promise<void> => {
  try {
    await markPayoutPaidPrisma(req.params.id, req.tenantId!);

    res.status(200).json({
      success: true,
      message: "Payout marked as paid",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================
EXPORT CSV
=================================
*/
export const exportPayouts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payouts = await prisma.payout.findMany({
      where: {
        tenantId: req.tenantId!,
      },
      include: {
        affiliate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = payouts.map((item) => ({
      affiliate: item.affiliate.name,
      email: item.affiliate.email,
      amount: item.amount,
      status: item.status,
      date: item.createdAt.toLocaleDateString("en-IN"),
    }));

    exportCSV(
      res,
      data,
      ["affiliate", "email", "amount", "status", "date"],
      "payouts",
    );
  },
);
