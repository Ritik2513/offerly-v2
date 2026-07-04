import { Request, Response } from "express";
import { exportCSV } from "../../utils/csvExport.js";
import { getConversionsPrisma } from "./conversion.prisma.service.js";
import prisma from "../../config/prisma.js";

// GET conversions
export const getConversions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await getConversionsPrisma({
      tenantId: req.tenantId!,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: req.query.status as string,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversions",
    });
  }
};

// EXPORT CSV
export const exportConversions = async (req: Request, res: Response) => {
  try {
    const conversions = await prisma.conversion.findMany({
      where: {
        tenantId: req.tenantId!,
      },
      include: {
        affiliate: true,
        offer: true,
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

    return exportCSV(
      res,
      data,
      ["affiliate", "offer", "revenue", "payout", "status", "date"],
      "conversions",
    );
  } catch (error) {
    return res.status(500).json({
      message: "Failed to export conversions",
    });
  }
};
