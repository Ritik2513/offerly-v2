import { Request, Response } from "express";
import { PipelineStage } from "mongoose";
import Conversion from "./conversion.model.js";
import { exportCSV } from "../../utils/csvExport.js";

interface ConversionQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: "pending" | "approved" | "rejected";
}

interface AnalyticsItem {
  _id: string;
  count: number;
  revenue: number;
}

interface ExportRow {
  affiliate?: {
    name?: string;
  };
  offer?: {
    title?: string;
  };
  revenue: number;
  payout: number;
  status: string;
  createdAt: Date;
}

// GET conversions
export const getConversions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query as ConversionQuery;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const search = query.search?.trim() || "";
    const status = query.status || "";

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "affiliate",
          foreignField: "_id",
          as: "affiliate",
        },
      },
      {
        $unwind: "$affiliate",
      },
      {
        $lookup: {
          from: "offers",
          localField: "offer",
          foreignField: "_id",
          as: "offer",
        },
      },
      {
        $unwind: "$offer",
      },
      {
        $lookup: {
          from: "clicks",
          localField: "click",
          foreignField: "_id",
          as: "click",
        },
      },
      {
        $unwind: "$click",
      },
    ];

    const matchStage: Record<string, unknown> = {};

    // status filter
    if (status) {
      matchStage.status = status;
    }

    // search filter
    if (search) {
      matchStage.$or = [
        {
          "affiliate.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "affiliate.email": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "offer.title": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    // total records
    const totalResult = await Conversion.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalItems = totalResult[0]?.total || 0;

    // paginated conversions
    const conversions = await Conversion.aggregate([
      ...pipeline,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    // analytics
    const analyticsResult = await Conversion.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$revenue" },
        },
      },
    ]);

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let totalRevenue = 0;

    analyticsResult.forEach((item: AnalyticsItem) => {
      if (item._id === "approved") {
        approved = item.count;
        totalRevenue += item.revenue;
      }

      if (item._id === "pending") {
        pending = item.count;
      }

      if (item._id === "rejected") {
        rejected = item.count;
      }
    });

    const analytics = {
      approved,
      pending,
      rejected,
      totalRevenue,
    };

    res.status(200).json({
      success: true,
      data: conversions,
      analytics,
      pagination: {
        page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversions",
    });
  }
};

// EXPORT CSV
export const exportConversions = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const conversions = (await Conversion.find()
      .populate("affiliate", "name")
      .populate("offer", "title")
      .lean()) as unknown as ExportRow[];

    const data = conversions.map((item) => ({
      affiliate: item.affiliate?.name,
      offer: item.offer?.title,
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
      success: false,
      message: "Failed to export conversions",
    });
  }
};
