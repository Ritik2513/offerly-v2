import Conversion from "../conversions/conversion.model.js";
import Payout from "./payout.model.js";
import { exportCSV } from "../../utils/csvExport.js";

export const createPayout = async (req, res) => {
  try {
    const { affiliateId } = req.body;

    const conversions = await Conversion.find({
      affiliate: affiliateId,
      payout: { $gt: 0 },
      payoutStatus: {
        $ne: "paid",
      },
    });

    if (!conversions.length) {
      return res.status(400).json({
        success: false,
        message: "No payable conversions",
      });
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
      { payoutStatus: "paid" },
    );

    res.status(201).json({ success: true, payout });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create payout" });
  }
};

export const getPayout = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search?.trim() || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    const pipeline = [
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

    const matchStage = {};

    // Status Filter
    if (status) {
      matchStage.status = status;
    }

    // Search Filter
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

    // Total Records
    const totalResult = await Payout.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalItems = totalResult[0]?.total || 0;

    // Paginated Data
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

    // Analytics
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

    analyticsResult.forEach((item) => {
      totalPayouts += item.count;

      if (item._id === "paid") {
        totalPaid = item.amount;
      }

      if (item._id === "pending") {
        totalPending = item.amount;
      }
    });

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

export const markPayoutPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const payout = await Payout.findById(id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    if (payout.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payout already paid",
      });
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

export const exportPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("affiliate", "name email")
      .lean();

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
      message: "Failed to export payouts",
    });
  }
};
