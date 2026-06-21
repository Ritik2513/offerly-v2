import { Request, Response } from "express";
import { PipelineStage } from "mongoose";

import Conversion from "../conversions/conversion.model.js";
import Payout from "./payout.model.js";
import { exportCSV } from "../../utils/csvExport.js";

interface CreatePayoutBody {
  affiliateId: string;
}

interface PayoutQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: "pending" | "paid";
}

interface AnalyticsItem {
  _id: string;
  count: number;
  amount: number;
}

interface ExportPayoutRow {
  affiliate?: {
    name?: string;
    email?: string;
  };

  amount: number;
  status: string;
  createdAt: Date;
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
    const body = req.body as CreatePayoutBody;

    const { affiliateId } = body;

    const conversions = await Conversion.find({
      affiliate: affiliateId,

      payout: {
        $gt: 0,
      },

      payoutStatus: {
        $ne: "paid",
      },
    });

    if (!conversions.length) {
      res.status(400).json({
        success: false,
        message: "No payable conversions",
      });

      return;
    }

    const totalAmount = conversions.reduce((acc, curr) => acc + curr.payout, 0);

    const payout = await Payout.create({
      affiliate: affiliateId,
      amount: totalAmount,
      conversions: conversions.map((c) => c._id),
    });

    await Conversion.updateMany(
      {
        _id: {
          $in: conversions.map((c) => c._id),
        },
      },

      {
        payoutStatus: "paid",
      },
    );

    res.status(201).json({
      success: true,
      payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payout",
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
    ];

    const matchStage: any = {};

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
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    // total count
    const totalResult = await Payout.aggregate([
      ...pipeline,

      {
        $count: "total",
      },
    ]);

    const totalItems = totalResult[0]?.total || 0;

    // paginated data
    const payouts = await Payout.aggregate([
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
    const analyticsResult = await Payout.aggregate([
      ...(Object.keys(matchStage).length > 0
        ? [
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
              $match: matchStage,
            },
          ]
        : []),

      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },

          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    let totalPaid = 0;
    let totalPending = 0;
    let totalPayouts = 0;

    analyticsResult.forEach((item: AnalyticsItem) => {
      totalPayouts += item.count;

      if (item._id === "paid") {
        totalPaid = item.amount;
      }

      if (item._id === "pending") {
        totalPending = item.amount;
      }
    });

    // unique affiliates
    const uniqueAffiliatesResult = await Payout.aggregate([
      ...(Object.keys(matchStage).length > 0
        ? [
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
              $match: matchStage,
            },
          ]
        : []),

      {
        $group: {
          _id: "$affiliate",
        },
      },

      {
        $count: "count",
      },
    ]);

    const uniqueAffiliates = uniqueAffiliatesResult[0]?.count || 0;

    res.status(200).json({
      success: true,

      data: payouts,

      analytics: {
        totalPaid,
        totalPending,
        totalPayouts,
        uniqueAffiliates,
      },

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
      message: "Failed to fetch payouts",
    });
  }
};

/*
=================================
MARK PAID
=================================
*/

export const markPayoutPaid = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as {
      id: string;
    };

    const payout = await Payout.findById(id);

    if (!payout) {
      res.status(404).json({
        success: false,
        message: "Payout not found",
      });

      return;
    }

    if (payout.status === "paid") {
      res.status(400).json({
        success: false,
        message: "Payout already paid",
      });

      return;
    }

    payout.status = "paid";

    payout.paidAt = new Date();

    await payout.save();

    res.status(200).json({
      success: true,
      message: "Payout marked as paid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payout",
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
    const payouts = (await Payout.find()
      .populate("affiliate", "name email")
      .lean()) as unknown as ExportPayoutRow[];

    const data = payouts.map((item) => ({
      affiliate: item.affiliate?.name,

      email: item.affiliate?.email,

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export payouts",
    });
  }
};
