import { Request, Response } from "express";
import { exportCSV } from "../../utils/csvExport.js";

import {
  createPayoutPrisma,
  getPayoutPrisma,
  markPayoutPaidPrisma,
} from "./payout.prisma.service.js";

import prisma from "../../config/prisma.js";

interface PayoutQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

interface PayoutParams {
  id: string;
}

/*
=================================
CREATE PAYOUT
=================================
*/
export const createPayout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { affiliateId } = req.body;

    const payout = await createPayoutPrisma(affiliateId);

    res.status(201).json({
      success: true,
      payout,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payout",
    });
  }
};

/*
=================================
GET PAYOUTS
=================================
*/
export const getPayout = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as PayoutQuery;

    const result = await getPayoutPrisma({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search?.trim() || "",
      status: query.status || "",
    });

    res.status(200).json({
      success: true,
      data: result.payouts,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payouts",
    });
  }
};

/*
=================================
MARK PAYOUT PAID
=================================
*/
export const markPayoutPaid = async (
  req: Request<PayoutParams>,
  res: Response,
): Promise<void> => {
  try {
    await markPayoutPaidPrisma(req.params.id);

    res.status(200).json({
      success: true,
      message: "Payout marked as paid",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payout",
    });
  }
};

/*
=================================
EXPORT PAYOUTS
=================================
*/
export const exportPayouts = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const payouts = await prisma.payout.findMany({
      include: {
        affiliate: true,
      },
    });

    const data = payouts.map((item) => ({
      affiliate: item.affiliate.name,
      email: item.affiliate.email,
      amount: item.amount,
      status: item.status,
      date: item.createdAt.toLocaleDateString("en-IN"),
    }));

    return exportCSV(
      res,
      data,
      ["affiliate", "email", "amount", "status", "date"],
      "payouts",
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to export payouts",
    });
  }
};
